# 🛡️ PRODUCTION CODE PROTECTION RULES

## ⚠️ CRITICAL RULES - NEVER BREAK THESE

### **RULE #1: ASK BEFORE TOUCHING**
- **NEVER** modify any code without explicit permission
- **ALWAYS** ask "Is this currently working in production?" before changing anything
- **ALWAYS** get approval for each specific change

### **RULE #2: UNDERSTAND BEFORE CHANGING**
- **NEVER** assume something needs to be "fixed" or "improved"
- **ALWAYS** understand the current implementation and WHY it works that way
- **ALWAYS** ask "What specific problem are we trying to solve?"

### **RULE #3: TEST LOCALLY FIRST**
- **NEVER** push changes directly to production
- **ALWAYS** test changes locally first
- **ALWAYS** verify the fix works before deploying

### **RULE #4: ONE CHANGE AT A TIME**
- **NEVER** make multiple unrelated changes in one commit
- **ALWAYS** make small, focused changes
- **ALWAYS** test each change individually

### **RULE #5: HAVE A ROLLBACK PLAN**
- **NEVER** make changes without knowing how to revert them
- **ALWAYS** know what the previous working state was
- **ALWAYS** be able to quickly restore functionality

## 🚨 EMERGENCY STOP COMMANDS

If the user says any of these, IMMEDIATELY stop what you're doing:

- **"STOP"** - Stop all code changes immediately
- **"REVERT"** - Help revert to last working state
- **"EXPLAIN"** - Explain what was changed and why
- **"WORKING CODE"** - Don't touch anything that's currently working

## 🎯 FOCUS PRINCIPLES

### **What TO Do:**
- ✅ Fix specific, identified bugs
- ✅ Add new features when requested
- ✅ Improve performance when there's a clear problem
- ✅ Update documentation
- ✅ Add logging/debugging when needed

### **What NOT To Do:**
- ❌ "Improve" working code without permission
- ❌ Add validation to working APIs
- ❌ Change working configurations
- ❌ Refactor working code for "best practices"
- ❌ Add security measures that break functionality
- ❌ Change working deployment processes

## 📋 MANDATORY QUESTIONS BEFORE ANY CHANGE

Before making ANY code change, ask:

1. **"What specific error or issue are we trying to fix?"**
2. **"Is this feature currently working in production?"**
3. **"What's the minimal change needed to fix this specific issue?"**
4. **"Can we test this change locally first?"**
5. **"Do you approve this specific change?"**

## 🔒 PROTECTION LEVELS

### **Level 1: CRITICAL (Never Touch Without Permission)**
- Authentication/security systems
- Database connections
- Payment processing
- User data handling
- Production API endpoints that are working
- Deployment configurations

### **Level 2: SENSITIVE (Ask First)**
- Core business logic
- Third-party integrations (Replicate, Cloudinary, etc.)
- CORS settings
- Environment configurations

### **Level 3: SAFE (Can Modify With Approval)**
- Frontend UI improvements
- New features
- Documentation
- Logging/debugging code

## 📝 CHANGE LOG REQUIREMENTS

Every change must include:
- **What** was changed
- **Why** it was changed
- **What problem** it solves
- **How to revert** if needed
- **What was tested** locally

## 🤝 USER'S RIGHTS

The user has the right to:
- ✅ Stop any change at any time
- ✅ Demand explanation of any modification
- ✅ Request immediate rollback
- ✅ Reject any proposed change
- ✅ Ask for local testing first

## 💡 COMMUNICATION PROTOCOL

### **Before Making Changes:**
- "I want to modify [specific file/function] to fix [specific issue]. Is this currently working in production?"
- "Can I make this specific change: [describe exact change]?"
- "Should we test this locally first?"

### **During Changes:**
- "Making this specific change: [describe what's happening]"
- "Testing locally before pushing to production"

### **After Changes:**
- "Change completed: [what was changed]"
- "Local testing results: [what was tested]"
- "Ready to deploy, or should we test more?"

---

**These rules are designed to protect working production systems and ensure changes are intentional, tested, and approved.**

