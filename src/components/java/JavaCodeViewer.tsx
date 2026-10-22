import React, { useState } from 'react';
import { javaSourceFiles, JavaSourceFile } from '../../data/javaCodeRepository';
import JSZip from 'jszip';
import {
  Code,
  FileCode,
  Download,
  Copy,
  Check,
  Folder,
  Layers,
  Database,
  Shield,
  Sparkles,
  ExternalLink,
  Terminal,
} from 'lucide-react';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(javaSourceFiles[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const categories = Array.from(new Set(javaSourceFiles.map((f) => f.category)));

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Add all java files with proper folder structure
      javaSourceFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add README.md
      const readme = `# AuraStudio ERP & Client Portal Backend (Java Spring Boot 3)

## Features
- **Client-Wise Studio Management**: Entities for Clients, Shoots, Photos, Invoices.
- **Dual Authentication**: Spring Security 6 with JWT for Admin (Studio Owner) and Client portals.
- **Official Invoicing & GST**: Full Tax Invoice calculations with line items.
- **Photo Proofing API**: Mark favorites, album selections, and client notes.
- **Relational Database**: PostgreSQL / MySQL compatible schema.

## Requirements
- Java 21 or Java 17+
- Maven 3.8+
- PostgreSQL 14+ (or MySQL 8+)

## How to Run:
1. Create database:
   \`CREATE DATABASE aurastudio_db;\`
2. Update database credentials in \`src/main/resources/application.properties\`.
3. Run the application:
   \`mvn clean install\`
   \`mvn spring-boot:run\`
4. Access API endpoints at: \`http://localhost:8080\`
`;
      zip.file('README.md', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aurastudio-backend-spring-boot.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Code className="w-3.5 h-3.5" />
            <span>Official Java Spring Boot Source Code Repository</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Java Backend Architecture &amp; Database
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            You requested the code in Java. Here is the complete production-grade Java Spring Boot 3 enterprise backend codebase with JPA Entities, Repositories, REST Controllers, Security, and SQL Schema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 text-xs font-semibold rounded-lg transition-colors shadow-md whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingZip ? 'Creating ZIP...' : 'Download Full Java Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main IDE-Style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-800 p-4 space-y-5 bg-neutral-950/60">
          <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Java Project Explorer</span>
            <span className="font-mono text-[10px] text-amber-400">{javaSourceFiles.length} files</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {categories.map((category) => (
              <div key={category} className="space-y-1">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 flex items-center gap-1.5">
                  <Folder className="w-3 h-3 text-neutral-600" />
                  <span>{category}</span>
                </div>

                <div className="space-y-0.5">
                  {javaSourceFiles
                    .filter((f) => f.category === category)
                    .map((file) => {
                      const isSelected = selectedFile.name === file.name;
                      return (
                        <button
                          key={file.name}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-500/10 text-amber-400 font-medium border border-amber-500/30'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileCode className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          {file.name.endsWith('.sql') && (
                            <span className="text-[9px] text-neutral-500 uppercase font-sans">SQL</span>
                          )}
                          {file.name.endsWith('.java') && (
                            <span className="text-[9px] text-amber-500/80 uppercase font-sans">JAVA</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Terminal Guide */}
          <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-300">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>How to run Java Backend:</span>
            </div>
            <pre className="font-mono text-[10px] text-neutral-400 bg-neutral-950 p-2 rounded border border-neutral-800/80 overflow-x-auto">
              mvn clean install{'\n'}mvn spring-boot:run
            </pre>
          </div>
        </div>

        {/* Right Code Display Stage */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-neutral-950">
          {/* File Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-neutral-900/60">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="text-neutral-500 text-[11px] font-sans">({selectedFile.path})</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-5 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-neutral-300 bg-neutral-950">
            <pre className="selection:bg-amber-500 selection:text-neutral-950">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
