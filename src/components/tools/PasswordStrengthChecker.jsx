import React, { useState, useEffect } from 'react';
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Progress } from "@/components/ui/progress";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Lock } from 'lucide-react';

    const PasswordStrengthChecker = () => {
      const [password, setPassword] = useState('');
      const [strength, setStrength] = useState(0);
      const [feedback, setFeedback] = useState('');

      useEffect(() => {
        let score = 0;
        if (!password) {
          setStrength(0);
          setFeedback('');
          return;
        }
        if (password.length >= 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        setStrength(score);

        if (score < 50) setFeedback('Weak');
        else if (score < 75) setFeedback('Moderate');
        else if (score < 100) setFeedback('Strong');
        else setFeedback('Very Strong');
      }, [password]);

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><Lock className="mr-2 h-6 w-6 text-sky-400" /> Password Strength</CardTitle>
            <CardDescription>Enter a password to check its strength.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password-strength">Password</Label>
              <Input 
                id="password-strength" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password" 
              />
            </div>
            <div>
              <Progress value={strength} className="w-full h-3" />
              <p className={`mt-2 text-sm ${strength === 0 ? 'text-slate-400' : strength < 50 ? 'text-red-400' : strength < 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                {password ? `Strength: ${feedback}` : 'Enter a password to see its strength.'}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default PasswordStrengthChecker;