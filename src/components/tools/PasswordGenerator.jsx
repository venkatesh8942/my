import React, { useState, useCallback } from 'react';
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Slider } from "@/components/ui/slider";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { useToast } from "@/components/ui/use-toast";
    import { KeyRound, Copy, Check, RefreshCw } from 'lucide-react';
    import { motion } from 'framer-motion';

    const PasswordGenerator = () => {
      const [password, setPassword] = useState('');
      const [length, setLength] = useState(16);
      const [includeUppercase, setIncludeUppercase] = useState(true);
      const [includeLowercase, setIncludeLowercase] = useState(true);
      const [includeNumbers, setIncludeNumbers] = useState(true);
      const [includeSymbols, setIncludeSymbols] = useState(true);
      const { toast } = useToast();
      const [copied, setCopied] = useState(false);

      const generatePassword = useCallback(() => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const nums = '0123456789';
        const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let charset = '';
        if (includeUppercase) charset += upper;
        if (includeLowercase) charset += lower;
        if (includeNumbers) charset += nums;
        if (includeSymbols) charset += syms;

        if (!charset) {
          toast({ variant: "destructive", title: "Cannot Generate", description: "Please select at least one character type." });
          setPassword('');
          return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
          newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
        setCopied(false); 
        toast({ title: "Password Generated", description: "New secure password created." });
      }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, toast]);

      useState(() => {
        generatePassword();
      }, [generatePassword]);


      const copyToClipboard = () => {
        if (!password) {
            toast({ variant: "destructive", title: "Nothing to Copy", description: "Generate a password first." });
            return;
        }
        navigator.clipboard.writeText(password).then(() => {
          setCopied(true);
          toast({ title: "Copied!", description: "Password copied to clipboard." });
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
      };

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><KeyRound className="mr-2 h-6 w-6 text-sky-400" /> Complex Password Generator</CardTitle>
            <CardDescription>Create strong, random passwords to enhance your security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-700 rounded-md flex items-center justify-between">
              <motion.span 
                key={password}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg sm:text-xl font-mono text-sky-300 break-all flex-1 mr-2"
              >
                {password || "Click 'Generate'"}
              </motion.span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={generatePassword} title="Generate new password">
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy password" disabled={!password}>
                  {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="length">Password Length:</Label>
                  <span className="text-sky-400 font-medium">{length}</span>
                </div>
                <Slider
                  id="length"
                  min={8}
                  max={64}
                  step={1}
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="uppercase-gen" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase-gen" className="font-normal text-slate-300">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowercase-gen" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase-gen" className="font-normal text-slate-300">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers-gen" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers-gen" className="font-normal text-slate-300">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="symbols-gen" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols-gen" className="font-normal text-slate-300">Symbols (!@#)</Label>
                </div>
              </div>
            </div>
             <Button onClick={generatePassword} className="w-full bg-sky-500 hover:bg-sky-600 mt-2">
                Generate Password
            </Button>
          </CardContent>
        </Card>
      );
    };

    export default PasswordGenerator;