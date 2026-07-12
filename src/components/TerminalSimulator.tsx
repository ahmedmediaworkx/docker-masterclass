import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, CheckCircle2, HelpCircle, Copy } from 'lucide-react';
import { LabDetails, LabStep } from '../types';

interface TerminalSimulatorProps {
  labDetails: LabDetails;
  onLabComplete: () => void;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ labDetails, onLabComplete }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [inputCommand, setInputCommand] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<{ type: 'input' | 'output' | 'error' | 'success'; text: string }[]>([
    { type: 'output', text: `Welcome to the Docker Interactive Sandbox Terminal v1.1` },
    { type: 'output', text: `Type 'help' for available commands, or follow the lab guide on the left.` },
    { type: 'output', text: `Workspace path: /home/docker/tutorial` },
    { type: 'output', text: `` }
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(labDetails.steps.length).fill(false));
  const [isLabFinished, setIsLabFinished] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeStep: LabStep = labDetails.steps[currentStepIdx];

  // Auto scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Reset lab state if the lab changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setInputCommand('');
    setCompletedSteps(new Array(labDetails.steps.length).fill(false));
    setIsLabFinished(false);
    setTerminalHistory([
      { type: 'output', text: `Welcome to the Docker Interactive Sandbox Terminal v1.1` },
      { type: 'output', text: `Loading Lab: ${labDetails.labId.toUpperCase()} - ${labDetails.difficulty} Level` },
      { type: 'output', text: `Task: Follow the instructions on the left to start.` },
      { type: 'output', text: `` }
    ]);
  }, [labDetails]);

  const addHistoryLine = (text: string, type: 'input' | 'output' | 'error' | 'success' = 'output') => {
    setTerminalHistory((prev) => [...prev, { text, type }]);
  };

  const handleRunCommand = async (commandToRun: string) => {
    if (isExecuting || !commandToRun.trim()) return;

    setIsExecuting(true);
    addHistoryLine(`$ ${commandToRun}`, 'input');
    setInputCommand('');

    const normalizedCmd = commandToRun.trim().replace(/\s+/g, ' ');

    // Simulated terminal network delay / container build logs
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Handle standard generic commands
    if (normalizedCmd.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      setIsExecuting(false);
      return;
    }

    if (normalizedCmd.toLowerCase() === 'help') {
      addHistoryLine('Available commands inside this lab environment:', 'output');
      addHistoryLine('  help                - Display this menu', 'output');
      addHistoryLine('  clear               - Clear terminal viewport', 'output');
      addHistoryLine('  ls                  - List files in current directory', 'output');
      addHistoryLine('  cat [file]          - View contents of a file', 'output');
      addHistoryLine(`  ${activeStep.command} - Run the required command for the current step`, 'output');
      setIsExecuting(false);
      return;
    }

    if (normalizedCmd.toLowerCase() === 'ls') {
      if (labDetails.labId === 'lab4' || labDetails.labId === 'lab5' || labDetails.labId === 'lab7') {
        addHistoryLine('Dockerfile    index.js    package.json', 'output');
      } else {
        addHistoryLine('No files in this workspace directory.', 'output');
      }
      setIsExecuting(false);
      return;
    }

    // Check if command matches target step command
    const targetCommandNormalized = activeStep.command.trim().replace(/\s+/g, ' ');

    if (normalizedCmd === targetCommandNormalized) {
      // Simulate slow progressive layers printing for pull commands or container builds
      if (normalizedCmd.includes('pull') || normalizedCmd.includes('run') || normalizedCmd.includes('build')) {
        addHistoryLine('Connecting to Docker Hub repository...', 'output');
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        // Split expected output to show step-by-step
        const outputLines = activeStep.expectedOutput.split('\n');
        for (const line of outputLines) {
          addHistoryLine(line, 'output');
          // Fast delay for realistic print
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } else {
        addHistoryLine(activeStep.expectedOutput, 'output');
      }

      // Mark step as completed
      const updatedCompleted = [...completedSteps];
      updatedCompleted[currentStepIdx] = true;
      setCompletedSteps(updatedCompleted);

      addHistoryLine(`✓ Step ${currentStepIdx + 1} validated successfully!`, 'success');

      // Move to next step or complete lab
      if (currentStepIdx < labDetails.steps.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCurrentStepIdx((prev) => prev + 1);
        addHistoryLine(`--- NEXT TASK UNLOCKED: Step ${currentStepIdx + 2} ---`, 'success');
        addHistoryLine(labDetails.steps[currentStepIdx + 1].instruction, 'output');
      } else {
        setIsLabFinished(true);
        onLabComplete();
        addHistoryLine('🎉 CONGRATULATIONS! ALL LAB STEPS VALIDATED AND COMPLETED!', 'success');
      }
    } else {
      // Handle slight typos or wrong commands
      addHistoryLine(`Command execution complete.`, 'output');
      // Look for custom feedback based on input
      if (normalizedCmd.startsWith('docker') && !normalizedCmd.includes(activeStep.validationKeyword)) {
        addHistoryLine(`Docker Daemon: Valid command pattern but did not match the expected task.`, 'error');
        addHistoryLine(`Hint: ${activeStep.hint}`, 'output');
      } else {
        addHistoryLine(`bash: command not found: '${normalizedCmd.split(' ')[0]}'`, 'error');
        addHistoryLine(`Hint: Follow the step guide. Required command is: "${activeStep.command}"`, 'output');
      }
    }

    setIsExecuting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputCommand);
    }
  };

  const handleResetLab = () => {
    setCurrentStepIdx(0);
    setInputCommand('');
    setCompletedSteps(new Array(labDetails.steps.length).fill(false));
    setIsLabFinished(false);
    setTerminalHistory([
      { type: 'output', text: `Terminal environment reset.` },
      { type: 'output', text: `Loading Lab: ${labDetails.labId.toUpperCase()}` },
      { type: 'output', text: `Task: ${labDetails.steps[0].instruction}` },
      { type: 'output', text: `` }
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[480px]">
      {/* Left Column: Instructions and Steps */}
      <div className="lg:col-span-5 liquid-glass corner-box p-5 flex flex-col justify-between">
        {/* Bottom corner edge elements */}
        <div className="corner-box-bottom" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-[#2496ed] text-white font-mono text-[9px] uppercase tracking-[0.14em] rounded-none font-medium shadow-[0_0_8px_rgba(36,150,237,0.3)]">
              🫧 LAB ENVIRONMENT
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#969696] uppercase tracking-wider">
              <span>TIME: {labDetails.timeEstimate}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-none text-[9px] uppercase font-bold tracking-wider font-mono border ${
                labDetails.difficulty === 'Beginner' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-amber-950/40 border-amber-800 text-[#fff200]'
              }`}>
                {labDetails.difficulty}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-[#ffffff] font-semibold text-md uppercase tracking-tight flex items-center gap-1.5"><span>⚓</span> GUIDED CHALLENGE</h4>
            <p className="text-[#969696] text-xs leading-relaxed">
              Complete each step sequentially in the interactive CLI terminal to validate your Docker integration skills.
            </p>
          </div>

          {/* Stepper progress */}
          <div className="space-y-3 pt-2">
            {labDetails.steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-none border transition-all ${
                  idx === currentStepIdx
                    ? 'bg-[#0c2336] border-2 border-[#2496ed] shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : completedSteps[idx]
                    ? 'bg-[#031321]/40 border-[#113a5d]/55 opacity-60'
                    : 'bg-transparent border-[#113a5d]/20 opacity-30'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {completedSteps[idx] ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className={`w-4 h-4 rounded-none flex items-center justify-center font-mono text-[9px] font-bold ${
                      idx === currentStepIdx ? 'bg-[#2496ed] text-white' : 'bg-[#0c2336] text-[#969696]'
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <span className={`text-[10px] font-bold font-mono uppercase tracking-[0.15em] block ${idx === currentStepIdx ? 'text-[#00f0ff]' : 'text-[#969696]'}`}>
                    {step.title}
                  </span>
                  {idx === currentStepIdx && (
                    <>
                      <p className="text-[#c2d6e8] text-xs leading-relaxed">{step.instruction}</p>
                      
                      {/* Copyable code block with instant runner */}
                      <div className="bg-[#010915] border border-[#113a5d] rounded-none p-2.5 flex items-center justify-between font-mono text-xs text-[#ffffff]">
                        <code className="text-[#00f0ff] break-all select-all font-medium text-[11px]">{step.command}</code>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(step.command);
                              setInputCommand(step.command);
                            }}
                            title="Copy to terminal"
                            className="p-1 text-[#969696] hover:text-[#ffffff] hover:bg-[#0c2336] rounded-none transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRunCommand(step.command)}
                            disabled={isExecuting}
                            className="flex items-center gap-1 px-3 py-1 bg-[#2496ed] hover:bg-[#1d82ce] text-white rounded-none text-[9px] font-mono uppercase tracking-[0.12em] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_8px_rgba(36,150,237,0.3)]"
                          >
                            <Play className="w-2 h-2 fill-white text-white" />
                            RUN
                          </button>
                        </div>
                      </div>

                      {/* Hint Toggle */}
                      <div className="flex gap-2 items-center text-[11px] text-[#969696] bg-[#010915]/50 border border-[#113a5d] p-2.5 rounded-none">
                        <HelpCircle className="w-4 h-4 text-[#2496ed] shrink-0" />
                        <span><strong>HINT:</strong> {step.hint}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#113a5d]/70 flex items-center justify-between mt-4">
          <button
            onClick={handleResetLab}
            className="flex items-center gap-1.5 text-[#969696] hover:text-[#ffffff] text-[9px] font-mono uppercase tracking-[0.14em] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            RESET LAB STATE
          </button>
          {isLabFinished && (
            <span className="text-[10px] text-[#00f0ff] font-mono font-bold animate-pulse uppercase tracking-widest">
              🎉 CHALLENGE RUN COMPLETE!
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Simulated CLI Terminal */}
      <div className="lg:col-span-7 liquid-glass-intense corner-box overflow-hidden flex flex-col justify-between h-full font-mono text-[11px]">
        {/* Bottom corner edge elements */}
        <div className="corner-box-bottom" />
        {/* Terminal Header */}
        <div className="bg-[#0c2336] px-4 py-3 flex items-center justify-between border-b border-[#113a5d] select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#2496ed]" />
            <span className="text-[#969696] font-bold text-[9px] uppercase tracking-[0.14em]">DOCKER-SANDBOX-CLI-TERMINAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-[#2496ed]"></span>
            <span className="w-2 h-2 rounded-none bg-[#00f0ff]"></span>
            <span className="w-2 h-2 rounded-none bg-emerald-500"></span>
          </div>
        </div>

        {/* Terminal History Output */}
        <div className="flex-1 p-4 overflow-y-auto space-y-1.5 min-h-[300px] max-h-[400px] bg-black/55">
          {terminalHistory.map((line, idx) => {
            let textColor = 'text-[#ffffff]';
            if (line.type === 'input') textColor = 'text-[#00f0ff] font-bold';
            if (line.type === 'error') textColor = 'text-red-400';
            if (line.type === 'success') textColor = 'text-emerald-400 font-bold';

            return (
              <div key={idx} className={`${textColor} whitespace-pre-wrap leading-relaxed`}>
                {line.text}
              </div>
            );
          })}
          {isExecuting && (
            <div className="text-slate-500 animate-pulse font-bold text-[10px] tracking-wider uppercase">
              EXECUTING CONTAINER INSTANCE...
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="p-3.5 bg-[#010915]/50 border-t border-[#113a5d] flex items-center gap-2">
          <span className="text-[#2496ed] font-bold font-mono">$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isExecuting || isLabFinished}
            placeholder={isLabFinished ? 'CHALLENGE COMPLETE. RESET LAB TO RUN AGAIN.' : 'ENTER DOCKER COMMAND...'}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-[#969696]/40 disabled:opacity-40"
          />
          {!isLabFinished && (
            <button
              onClick={() => handleRunCommand(inputCommand)}
              disabled={isExecuting || !inputCommand.trim()}
              className="px-4 py-1.5 bg-[#2496ed] hover:bg-[#1d82ce] text-white font-mono rounded-none font-bold transition-all disabled:opacity-30 text-[9px] uppercase tracking-[0.12em] cursor-pointer shadow-[0_0_8px_rgba(36,150,237,0.3)]"
            >
              EXECUTE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
