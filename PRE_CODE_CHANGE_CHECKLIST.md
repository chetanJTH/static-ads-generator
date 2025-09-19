# ✅ PRE-CODE CHANGE CHECKLIST

## 🛑 MANDATORY CHECKLIST - Complete BEFORE making ANY code changes

### **□ 1. UNDERSTAND THE CURRENT STATE**
- [ ] Is this feature/endpoint currently working in production?
- [ ] How does it work right now?
- [ ] What is the current user experience?
- [ ] Are there any existing workarounds in place?

### **□ 2. IDENTIFY THE SPECIFIC PROBLEM**
- [ ] What exactly is broken or needs to be changed?
- [ ] Do we have a specific error message or issue description?
- [ ] Is this a bug fix or a new feature request?
- [ ] Is this change actually necessary?

### **□ 3. GET USER APPROVAL**
- [ ] Have I asked: "Can I modify [specific file] to fix [specific issue]?"
- [ ] Has the user explicitly approved this change?
- [ ] Does the user understand what will be modified?
- [ ] Has the user confirmed this issue exists?

### **□ 4. PLAN THE MINIMAL CHANGE**
- [ ] What's the smallest possible change to fix this issue?
- [ ] Can I avoid changing working code?
- [ ] Are there any dependencies or side effects?
- [ ] Do I have a rollback plan?

### **□ 5. LOCAL TESTING PLAN**
- [ ] Can I test this change locally first?
- [ ] Do I have the necessary environment setup?
- [ ] What specific scenarios should I test?
- [ ] How will I verify the fix works?

---

## 🚨 RED FLAGS - STOP if ANY of these are true:

- ❌ "I think this code could be improved"
- ❌ "This isn't following best practices"
- ❌ "Let me add some validation/security"
- ❌ "I should refactor this"
- ❌ "This could be more efficient"
- ❌ User hasn't explicitly asked for this change
- ❌ I don't understand why current code works the way it does
- ❌ I'm making multiple unrelated changes at once

---

## ✅ GREEN LIGHTS - Proceed if ALL of these are true:

- ✅ User explicitly requested this specific change
- ✅ There's a clear, identified problem to solve
- ✅ I understand the current implementation
- ✅ I have a minimal, focused solution
- ✅ User has approved the approach
- ✅ I can test locally first
- ✅ I know how to revert if needed

---

## 📋 QUICK DECISION MATRIX

| Situation | Action |
|-----------|--------|
| User reports specific error | ✅ Investigate and fix |
| User requests new feature | ✅ Implement as requested |
| I notice "inefficient" code | ❌ Leave it alone unless user asks |
| Working code lacks validation | ❌ Don't add unless user requests |
| Code doesn't follow best practices | ❌ Don't change unless user asks |
| Security could be "improved" | ❌ Don't touch unless user reports issue |
| User says "it's working fine" | ❌ Don't modify anything |

---

## 🗣️ REQUIRED PHRASES BEFORE CODE CHANGES

**Always say one of these BEFORE making changes:**

- "I want to modify [file] to fix [specific issue]. Is this currently working in production?"
- "You mentioned [problem]. Can I make this specific change: [describe change]?"
- "To fix [error], I need to update [specific code]. Should I proceed?"
- "This change will [specific outcome]. Is that what you want?"

**NEVER start with:**
- "Let me improve this..."
- "I should add some validation..."
- "This code could be better..."
- "For security, I'll add..."

---

## 🎯 SUCCESS CRITERIA

**A successful code change:**
- ✅ Solves a specific, user-identified problem
- ✅ Was approved by the user beforehand
- ✅ Was tested locally first
- ✅ Doesn't break existing functionality
- ✅ Can be easily reverted if needed
- ✅ User is satisfied with the result

---

**Remember: Working code is SACRED. Touch it only when explicitly asked and with full understanding of the consequences.**

