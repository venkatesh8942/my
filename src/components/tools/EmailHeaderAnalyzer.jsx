import React, { useState } from 'react';
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { MailCheck, AlertTriangle, CheckCircle, XCircle, HelpCircle, ArrowRightCircle, Clock } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const EmailHeaderAnalyzer = () => {
      const [headerInput, setHeaderInput] = useState('');
      const [analysisResult, setAnalysisResult] = useState(null);
      const { toast } = useToast();

      const parseRawHeaders = (rawHeaders) => {
        const lines = rawHeaders.split(/\\r\\n|\\n|\\r/).filter(line => line.trim() !== '');
        const headers = {};
        let currentHeader = '';
        lines.forEach(line => {
          if (line.match(/^[A-Za-z0-9\-_]+:/)) {
            const [key, ...valueParts] = line.split(':');
            currentHeader = key.trim();
            headers[currentHeader] = (headers[currentHeader] || []).concat(valueParts.join(':').trim());
          } else if (currentHeader && (line.startsWith(' ') || line.startsWith('\\t'))) {
            if (headers[currentHeader] && headers[currentHeader].length > 0) {
              headers[currentHeader][headers[currentHeader].length - 1] += ' ' + line.trim();
            }
          }
        });
        
        for (const key in headers) {
          headers[key] = headers[key].map(val => val.trim()).join('; ');
        }
        return headers;
      };

      const analyzeEmailHeaders = (rawHeaders) => {
        const headers = parseRawHeaders(rawHeaders);
        if (Object.keys(headers).length === 0) {
          toast({ variant: "destructive", title: "Invalid Headers", description: "Could not parse any valid headers. Please check the input format." });
          return null;
        }

        const result = {
          summary: {},
          routing: [],
          authentication: [],
          other: []
        };

        const summaryFields = ['From', 'To', 'Cc', 'Bcc', 'Subject', 'Date', 'Message-ID', 'Return-Path', 'Reply-To'];
        summaryFields.forEach(field => {
          if (headers[field]) result.summary[field] = headers[field];
        });
        
        const receivedHeaders = [];
        Object.entries(headers).forEach(([key, value]) => {
          if (key.toLowerCase() === 'received') {
            receivedHeaders.push(value);
          }
        });
        result.routing = receivedHeaders.reverse().map((hop, index) => {
            const byMatch = hop.match(/by ([^ ;]+)/i);
            const fromMatch = hop.match(/from ([^ ;]+)/i);
            const viaMatch = hop.match(/via ([^ ;]+)/i);
            const forMatch = hop.match(/for <([^>]+)>/i);
            const dateMatch = hop.match(/; (.+)$/i);
            return {
                id: `hop-${index}`,
                hop: index + 1,
                from: fromMatch ? fromMatch[1] : 'N/A',
                by: byMatch ? byMatch[1] : 'N/A',
                via: viaMatch ? viaMatch[1] : null,
                for: forMatch ? forMatch[1] : null,
                timestamp: dateMatch ? dateMatch[1] : 'N/A',
                full: hop
            };
        });


        const authKeywords = ['DKIM-Signature', 'DomainKey-Signature', 'Authentication-Results', 'Received-SPF', 'ARC-Authentication-Results'];
        authKeywords.forEach(key => {
          if (headers[key]) {
            let status = 'neutral';
            let details = headers[key];
            if (details.toLowerCase().includes('pass')) status = 'pass';
            else if (details.toLowerCase().includes('fail')) status = 'fail';
            else if (details.toLowerCase().includes('softfail') || details.toLowerCase().includes('neutral') || details.toLowerCase().includes('none')) status = 'neutral';
            
            result.authentication.push({ name: key, value: details, status });
          }
        });
        
        Object.entries(headers).forEach(([key, value]) => {
          if (!summaryFields.includes(key) && !authKeywords.includes(key) && key.toLowerCase() !== 'received') {
            result.other.push({ name: key, value });
          }
        });

        return result;
      };

      const handleAnalyze = () => {
        if (!headerInput.trim()) {
          toast({ variant: "destructive", title: "Input Missing", description: "Please paste email headers to analyze." });
          setAnalysisResult(null);
          return;
        }
        try {
          const analysis = analyzeEmailHeaders(headerInput);
          setAnalysisResult(analysis);
          if(analysis) {
            toast({ title: "Headers Analyzed", description: "Email headers parsed and analyzed successfully." });
          }
        } catch (error) {
          console.error("Analysis error:", error);
          toast({ variant: "destructive", title: "Parsing Error", description: `An error occurred: ${error.message}` });
          setAnalysisResult(null);
        }
      };
      
      const getAuthIcon = (status) => {
        if (status === 'pass') return <CheckCircle className="h-5 w-5 text-green-400" />;
        if (status === 'fail') return <XCircle className="h-5 w-5 text-red-400" />;
        return <HelpCircle className="h-5 w-5 text-yellow-400" />;
      };

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><MailCheck className="mr-2 h-6 w-6 text-sky-400" /> Email Header Analyzer</CardTitle>
            <CardDescription>Paste raw email headers to analyze routing, authentication, and other details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header-input">Raw Email Headers</Label>
              <Textarea
                id="header-input"
                value={headerInput}
                onChange={(e) => setHeaderInput(e.target.value)}
                placeholder="Paste full email headers here (e.g., from 'Show Original' in your email client)..."
                className="min-h-[200px] bg-slate-700 border-slate-600 text-slate-50 font-mono text-xs"
              />
            </div>
            <Button onClick={handleAnalyze} className="w-full bg-sky-500 hover:bg-sky-600">Analyze Headers</Button>
            
            <AnimatePresence>
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-sky-300 border-b border-slate-700 pb-2 mb-3">Summary</h4>
                    {Object.entries(analysisResult.summary).map(([key, value]) => (
                      <div key={key} className="mb-2 p-3 bg-slate-700/50 rounded-md">
                        <p className="text-sm font-medium text-sky-400">{key}:</p>
                        <p className="text-xs text-slate-300 whitespace-pre-wrap break-all">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-sky-300 border-b border-slate-700 pb-2 mb-3">Routing Path (Hops)</h4>
                    <div className="space-y-3">
                    {analysisResult.routing.map((hop) => (
                      <Card key={hop.id} className="bg-slate-700/30 border-slate-600">
                        <CardHeader className="p-3">
                            <CardTitle className="text-base text-sky-400 flex items-center">
                                <ArrowRightCircle className="h-5 w-5 mr-2"/> Hop {hop.hop}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 text-xs space-y-1">
                            <p><strong className="text-slate-400">From:</strong> {hop.from}</p>
                            <p><strong className="text-slate-400">By:</strong> {hop.by}</p>
                            {hop.via && <p><strong className="text-slate-400">Via:</strong> {hop.via}</p>}
                            {hop.for && <p><strong className="text-slate-400">For:</strong> {hop.for}</p>}
                            <p className="flex items-center"><Clock className="h-3 w-3 mr-1 text-slate-500"/> <strong className="text-slate-400">Timestamp:</strong> {hop.timestamp}</p>
                        </CardContent>
                        <CardFooter className="p-3 text-xs text-slate-500 border-t border-slate-600">
                            <details>
                                <summary className="cursor-pointer hover:text-slate-400">Show full header</summary>
                                <p className="mt-1 whitespace-pre-wrap break-all">{hop.full}</p>
                            </details>
                        </CardFooter>
                      </Card>
                    ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-sky-300 border-b border-slate-700 pb-2 mb-3">Authentication Results</h4>
                    {analysisResult.authentication.length > 0 ? analysisResult.authentication.map((auth, index) => (
                      <div key={index} className="mb-2 p-3 bg-slate-700/50 rounded-md flex items-start">
                        <div className="mr-3 mt-0.5">{getAuthIcon(auth.status)}</div>
                        <div>
                          <p className="text-sm font-medium text-sky-400">{auth.name}:</p>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap break-all">{auth.value}</p>
                        </div>
                      </div>
                    )) : <p className="text-slate-400 text-sm">No specific authentication headers found.</p>}
                  </div>
                  
                  {analysisResult.other.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-sky-300 border-b border-slate-700 pb-2 mb-3">Other Headers</h4>
                       <details className="p-3 bg-slate-700/50 rounded-md cursor-pointer">
                        <summary className="text-sm font-medium text-sky-400 hover:text-sky-300">Show All Other Headers ({analysisResult.other.length})</summary>
                        <div className="mt-2 space-y-2">
                        {analysisResult.other.map((item, index) => (
                          <div key={index} className="border-t border-slate-600 pt-2">
                            <p className="text-sm font-medium text-sky-500">{item.name}:</p>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap break-all">{item.value}</p>
                          </div>
                        ))}
                        </div>
                      </details>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {!analysisResult && headerInput.trim() !== '' && (
                 <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-1" />
                    <div>
                        <p className="font-semibold text-yellow-300">No Results Yet</p>
                        <p className="text-sm text-yellow-400">Click "Analyze Headers" to see the results.</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default EmailHeaderAnalyzer;