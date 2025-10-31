import React, { useState, useCallback } from 'react';
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Textarea } from "@/components/ui/textarea";
    import { useToast } from "@/components/ui/use-toast";
    import { ListChecks, Copy, Check, Download } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const WordlistGenerator = () => {
      const [length, setLength] = useState(8);
      const [quantity, setQuantity] = useState(10);
      const [includeLowercase, setIncludeLowercase] = useState(true);
      const [includeUppercase, setIncludeUppercase] = useState(false);
      const [includeNumbers, setIncludeNumbers] = useState(false);
      const [includeSymbols, setIncludeSymbols] = useState(false);
      const [customChars, setCustomChars] = useState('');
      const [generatedList, setGeneratedList] = useState('');
      const { toast } = useToast();
      const [copied, setCopied] = useState(false);

      const generateWordlist = useCallback(() => {
        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        if (customChars) charset += customChars;

        if (!charset) {
          toast({ variant: "destructive", title: "Charset Empty", description: "Please select at least one character set or provide custom characters." });
          return;
        }
        if (length <= 0 || quantity <= 0) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Length and quantity must be greater than 0." });
            return;
        }

        let list = '';
        for (let i = 0; i < quantity; i++) {
          let word = '';
          for (let j = 0; j < length; j++) {
            word += charset.charAt(Math.floor(Math.random() * charset.length));
          }
          list += word + '\\n';
        }
        setGeneratedList(list.trim());
        toast({ title: "Wordlist Generated", description: `${quantity} words of length ${length} created.` });
      }, [length, quantity, includeLowercase, includeUppercase, includeNumbers, includeSymbols, customChars, toast]);

      const copyToClipboard = () => {
        if (!generatedList) {
            toast({ variant: "destructive", title: "Nothing to Copy", description: "Generate a wordlist first." });
            return;
        }
        navigator.clipboard.writeText(generatedList).then(() => {
          setCopied(true);
          toast({ title: "Copied!", description: "Wordlist copied to clipboard." });
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
      };

      const downloadList = () => {
        if (!generatedList) {
            toast({ variant: "destructive", title: "Nothing to Download", description: "Generate a wordlist first." });
            return;
        }
        const blob = new Blob([generatedList.replace(/\\n/g, '\\r\\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wordlist_${length}char_${quantity}words.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Wordlist downloaded as .txt file." });
      };

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-sky-400" /> Wordlist Generator</CardTitle>
            <CardDescription>Create custom wordlists for various purposes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="length">Word Length</Label>
                  <Input id="length" type="number" value={length} onChange={(e) => setLength(Math.max(1, parseInt(e.target.value)))} min="1" />
                </div>
                <div>
                  <Label htmlFor="quantity">Number of Words</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" />
                </div>
                <div>
                  <Label htmlFor="customChars">Custom Characters (optional)</Label>
                  <Input id="customChars" type="text" value={customChars} onChange={(e) => setCustomChars(e.target.value)} placeholder="e.g., abc123!@#" />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Character Sets:</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase" className="font-normal text-slate-300">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase" className="font-normal text-slate-300">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers" className="font-normal text-slate-300">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols" className="font-normal text-slate-300">Symbols (!@#...)</Label>
                </div>
              </div>
            </div>
            <Button onClick={generateWordlist} className="w-full bg-sky-500 hover:bg-sky-600">Generate Wordlist</Button>
            
            <AnimatePresence>
            {generatedList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-3"
              >
                <div className="flex justify-between items-center">
                    <Label htmlFor="generated-list">Generated Wordlist ({generatedList.split('\\n').length} words):</Label>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy list">
                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={downloadList} title="Download list">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Textarea
                  id="generated-list"
                  readOnly
                  value={generatedList}
                  className="min-h-[200px] bg-slate-700 border-slate-600 text-slate-50 font-mono text-xs"
                />
              </motion.div>
            )}
            </AnimatePresence>
          </CardContent>
        </Card>
      );
    };

    export default WordlistGenerator;