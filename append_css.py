
with open(r'c:\Users\rohan\finance-tracker\frontend\app\globals.css', 'a') as f:
    f.write('\n\n.custom-scrollbar::-webkit-scrollbar { width: 4px; }\n')
    f.write('.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }\n')
    f.write('.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }\n')
    f.write('.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }\n')
