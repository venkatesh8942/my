import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/components/ui/use-toast";
    import { Info, Copy, Check, Loader2 } from 'lucide-react';

    const UserInfoTool = () => {
      const [userInfo, setUserInfo] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();
      const [copiedStates, setCopiedStates] = useState({});

      const fetchUserInfo = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) {
            throw new Error(`Failed to fetch IP info: ${response.statusText}`);
          }
          const data = await response.json();
          setUserInfo({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country_name: data.country_name,
            isp: data.org,
            userAgent: navigator.userAgent,
          });
        } catch (err) {
          setError(err.message);
          toast({ variant: "destructive", title: "Error fetching IP info", description: err.message });
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchUserInfo();
      }, []);

      const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedStates(prev => ({ ...prev, [field]: true }));
          toast({ title: "Copied!", description: `${field} copied to clipboard.` });
          setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [field]: false }));
          }, 2000);
        }).catch(() => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
        });
      };

      const renderInfoItem = (label, value, fieldName) => {
        if (!value) return null;
        return (
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-400">{label}:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-50 font-medium break-all">{value}</span>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(value, fieldName)} className="h-8 w-8">
                {copiedStates[fieldName] ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-400 hover:text-sky-400" />}
              </Button>
            </div>
          </div>
        );
      };

      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><Info className="mr-2 h-6 w-6 text-sky-400" /> Your Information</CardTitle>
            <CardDescription>Displays your public IP address and browser User-Agent.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <p className="ml-2 text-slate-400">Fetching your info...</p>
              </div>
            )}
            {error && (
              <div className="text-red-400 bg-red-900/30 p-4 rounded-md">
                <p>Error: {error}</p>
                <Button onClick={fetchUserInfo} className="mt-2 bg-sky-500 hover:bg-sky-600">Retry</Button>
              </div>
            )}
            {userInfo && !loading && !error && (
              <div className="space-y-2">
                {renderInfoItem("IP Address", userInfo.ip, "IP Address")}
                {renderInfoItem("ISP", userInfo.isp, "ISP")}
                {renderInfoItem("City", userInfo.city, "City")}
                {renderInfoItem("Region", userInfo.region, "Region")}
                {renderInfoItem("Country", userInfo.country_name, "Country")}
                {renderInfoItem("User Agent", userInfo.userAgent, "User Agent")}
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default UserInfoTool;