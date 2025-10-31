import React, { useState } from 'react';
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { useToast } from "@/components/ui/use-toast";
    import { FileText, Copy, Check } from 'lucide-react';

    const Base64Tool = () => {
      const [inputText, setInputText] = useState('');
      const [outputText, setOutputText] = useState('');
      const [operation, setOperation] = useState('encode');
      const { toast } = useToast();
      const [copiedInput, setCopiedInput] = useState(false);
      const [copiedOutput, setCopiedOutput] = useState(false);

      const processText = () => {
        if (!inputText) {
          toast({ variant: "destructive", title: "Input missing", description: "Please enter text to process." });
          return;
        }
        try {
          if (operation === 'encode') {
            setOutputText(btoa(unescape(encodeURIComponent(inputText))));
            toast({ title: "Encoded", description: "Text successfully Base64 encoded." });
          } else {
            setOutputText(decodeURIComponent(escape(atob(inputText))));
            toast({ title: "Decoded", description: "Text successfully Base64 decoded." });
          }
        } catch (error) {
          setOutputText('Error: Invalid input for selected operation.');
          toast({ variant: "destructive", title: "Error", description: "Invalid input or operation failed. Ensure input is valid UTF-8 for encoding and valid Base64 for decoding." });
        }
      };

      const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
          if (type === 'input') setCopiedInput(true);
          else setCopiedOutput(true);
          toast({ title: "Copied!", description: `${type === 'input' ? 'Input' : 'Output'} text copied to clipboard.` });
          setTimeout(() => {
            if (type === 'input') setCopiedInput(false);
            else setCopiedOutput(false);
          }, 2000);
        }).catch(() => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
      };

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-6 w-6 text-sky-400" /> Base64 Encoder/Decoder</CardTitle>
            <CardDescription>Encode text to Base64 or decode Base64 text. Handles UTF-8 characters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                onClick={() => setOperation('encode')} 
                variant={operation === 'encode' ? 'default' : 'outline'}
                className={`w-full ${operation === 'encode' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                Encode
              </Button>
              <Button 
                onClick={() => setOperation('decode')} 
                variant={operation === 'decode' ? 'default' : 'outline'}
                className={`w-full ${operation === 'decode' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                Decode
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="base64-input">Input Text</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="base64-input" 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  placeholder={operation === 'encode' ? 'Enter text to encode' : 'Enter Base64 to decode'}
                />
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(inputText, 'input')}>
                  {copiedInput ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={processText} className="w-full bg-sky-500 hover:bg-sky-600">
              {operation === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
            </Button>
            {outputText && (
              <div className="mt-4 p-3 bg-slate-700 rounded-md space-y-2">
                <Label>Output Text:</Label>
                <div className="flex items-center gap-2">
                  <Input type="text" readOnly value={outputText} className="bg-slate-600 text-slate-200"/>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(outputText, 'output')}>
                    {copiedOutput ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default Base64Tool;