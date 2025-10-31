import React, { useState } from 'react';
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { useToast } from "@/components/ui/use-toast";
    import { Hash, ShieldCheck, Copy, Check } from 'lucide-react';

    const HashGenerator = () => {
      const [inputText, setInputText] = useState('');
      const [hashType, setHashType] = useState('SHA-256');
      const [generatedHash, setGeneratedHash] = useState('');
      const [verifyText, setVerifyText] = useState('');
      const [hashToVerify, setHashToVerify] = useState('');
      const [verifyHashType, setVerifyHashType] = useState('SHA-256');
      const [isVerified, setIsVerified] = useState(null);
      const { toast } = useToast();
      const [copiedHash, setCopiedHash] = useState(false);

      const generateHashInternal = async (text, type) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest(type, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };
      
      const handleGenerateHash = async () => {
        if (!inputText) {
          toast({ variant: "destructive", title: "Input missing", description: "Please enter text to hash." });
          return;
        }
        try {
          const hashHex = await generateHashInternal(inputText, hashType);
          setGeneratedHash(hashHex);
          toast({ title: "Hash Generated", description: `Successfully generated ${hashType} hash.` });
        } catch (error) {
          console.error("Hash generation error:", error);
          toast({ variant: "destructive", title: "Error", description: `Failed to generate hash. ${error.message}` });
        }
      };
      
      const handleVerifyHash = async () => {
        if (!verifyText || !hashToVerify) {
          toast({ variant: "destructive", title: "Input missing", description: "Please enter text and hash to verify." });
          return;
        }
        try {
          const currentHashHex = await generateHashInternal(verifyText, verifyHashType);
          setIsVerified(currentHashHex === hashToVerify.toLowerCase().trim());
        } catch (error) {
          console.error("Hash verification error:", error);
          toast({ variant: "destructive", title: "Error", description: `Failed to verify hash. ${error.message}` });
          setIsVerified(false);
        }
      };

      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedHash(true);
          toast({ title: "Copied!", description: "Hash copied to clipboard." });
          setTimeout(() => setCopiedHash(false), 2000);
        }).catch(() => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
      };

      return (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center"><Hash className="mr-2 h-6 w-6 text-sky-400" /> Generate Hash</CardTitle>
              <CardDescription>Generate a hash from your input text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hash-input">Text to Hash</Label>
                <Input id="hash-input" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Enter text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hash-type">Hash Algorithm</Label>
                <Select value={hashType} onValueChange={setHashType}>
                  <SelectTrigger id="hash-type">
                    <SelectValue placeholder="Select hash type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHA-1">SHA-1</SelectItem>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-384">SHA-384</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateHash} className="w-full bg-sky-500 hover:bg-sky-600">Generate Hash</Button>
              {generatedHash && (
                <div className="mt-4 p-3 bg-slate-700 rounded-md space-y-2">
                  <Label>Generated Hash ({hashType}):</Label>
                  <div className="flex items-center gap-2">
                    <Input type="text" readOnly value={generatedHash} className="bg-slate-600 text-slate-200"/>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedHash)}>
                      {copiedHash ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-sky-400" /> Verify Hash</CardTitle>
              <CardDescription>Verify if a hash matches the input text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verify-text">Original Text</Label>
                <Input id="verify-text" value={verifyText} onChange={(e) => setVerifyText(e.target.value)} placeholder="Enter original text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verify-hash">Hash to Verify</Label>
                <Input id="verify-hash" value={hashToVerify} onChange={(e) => setHashToVerify(e.target.value)} placeholder="Enter hash" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="verify-hash-type">Hash Algorithm</Label>
                 <Select value={verifyHashType} onValueChange={setVerifyHashType}>
                  <SelectTrigger id="verify-hash-type">
                    <SelectValue placeholder="Select hash type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHA-1">SHA-1</SelectItem>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-384">SHA-384</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleVerifyHash} className="w-full bg-sky-500 hover:bg-sky-600">Verify Hash</Button>
              {isVerified !== null && (
                <div className={`mt-4 p-3 rounded-md text-center font-semibold ${isVerified ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                  {isVerified ? 'Hash Verified: Matches!' : 'Hash Verification Failed: Does not match!'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    export default HashGenerator;