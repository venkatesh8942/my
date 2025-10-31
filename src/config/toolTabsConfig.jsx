import React from 'react';
    import { ListChecks, Lock, Hash, FileText, KeyRound, Info, MailCheck } from 'lucide-react';

    import PasswordStrengthChecker from "@/components/tools/PasswordStrengthChecker";
    import HashGenerator from "@/components/tools/HashGenerator";
    import Base64Tool from "@/components/tools/Base64Tool";
    import UserInfoTool from "@/components/tools/UserInfoTool";
    import EmailHeaderAnalyzer from "@/components/tools/EmailHeaderAnalyzer";
    import WordlistGenerator from "@/components/tools/WordlistGenerator";
    import PasswordGenerator from "@/components/tools/PasswordGenerator";

    export const toolTabsConfig = [
      { id: "password-strength", label: "Strength Check", icon: Lock, component: <PasswordStrengthChecker /> },
      { id: "hash-generator", label: "Hash Tool", icon: Hash, component: <HashGenerator /> },
      { id: "base64", label: "Base64", icon: FileText, component: <Base64Tool /> },
      { id: "user-agent", label: "My Info", icon: Info, component: <UserInfoTool /> },
      { id: "email-header", label: "Email Analyzer", icon: MailCheck, component: <EmailHeaderAnalyzer /> },
      { id: "wordlist-generator", label: "Wordlist Gen", icon: ListChecks, component: <WordlistGenerator /> },
      { id: "password-generator", label: "Pass Gen", icon: KeyRound, component: <PasswordGenerator /> },
    ];