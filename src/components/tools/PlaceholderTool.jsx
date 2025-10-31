import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

    const PlaceholderTool = ({ title, icon: IconComponent }) => (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            {IconComponent && <IconComponent className="mr-2 h-6 w-6 text-sky-400" />} {title}
          </CardTitle>
          <CardDescription>This tool is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Coming soon!</p>
        </CardContent>
      </Card>
    );

    export default PlaceholderTool;