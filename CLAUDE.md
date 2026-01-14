# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Workout Plan Generator - A bilingual (Chinese/English) MVP fitness training plan generator that uses AI (DeepSeek) or rule-based templates to create personalized workout plans. Built with React 18 + TypeScript + Vite + Tailwind CSS. Deployed as a pure frontend application with no backend dependencies.

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build (http://localhost:4173)
npm run lint         # Run ESLint
```

### Testing Before Deployment
Always test the production build locally before deploying:
```bash
npm run build && npm run preview
```

## Change Log Policy

**CRITICAL**: Every modification to this codebase MUST be documented in `DEVELOPMENT_LOG.md` at the project root.

### When to Log Changes

Record entries for:
- ✅ Feature additions or modifications
- ✅ Bug fixes and issue resolutions
- ✅ Architecture or API changes
- ✅ Refactoring that affects behavior
- ✅ Configuration updates
- ✅ Dependency updates that affect functionality
- ✅ Performance optimizations
- ✅ Breaking changes

Do NOT log:
- ❌ Typo fixes in comments
- ❌ Pure code formatting/linting changes
- ❌ Minor documentation updates

### How to Log Changes

After completing any significant modification, **immediately** add an entry to `DEVELOPMENT_LOG.md` following this format:

```markdown
## [YYYY-MM-DD HH:MM] - Brief Title

### Operation | 操作
- What was changed (be specific about files and functions)
- Why this change was made
- What approach was taken

### Files Modified | 修改的文件
- `path/to/file1.ts:line_range` - Description of changes
- `path/to/file2.tsx:line_range` - Description of changes

### Results | 结果
- ✅ What works now / What was achieved
- ⚠️ Any warnings or known issues
- 📊 Performance/size impact (if applicable)

### Testing | 测试
- [ ] Local dev server tested (`npm run dev`)
- [ ] Production build successful (`npm run build`)
- [ ] Production preview verified (`npm run preview`)
- [ ] Specific functionality tested: [describe]

### Notes | 备注
[Any additional context, trade-offs, or future considerations]

---
```

**Best Practices:**
1. Be specific - include exact file paths and function names
2. Document trade-offs and limitations
3. Include testing details and how to verify changes
4. Link related changes if building on earlier work
5. Update immediately - don't batch unrelated changes
6. Write for future developers (including future Claude instances)

Before making changes, read `DEVELOPMENT_LOG.md` to understand recent development history.


## Architecture Overview

### Dual Generation System

The application has **two plan generation modes**:

1. **AI Generation Mode** (`src/lib/aiPlanGenerator.ts`):
   - Primary mode using DeepSeek API (deepseek-chat or deepseek-reasoner)
   - Supports streaming responses for real-time display
   - Automatically falls back to rule-based generation on API failures
   - API configuration priority: Custom user config > Environment variables

2. **Rule-Based Generation Mode** (`src/lib/planGenerator.ts`):
   - Fallback system using predefined templates and algorithms
   - Always available even without API configuration
   - Used when: API not configured, API call fails, or AI response validation fails

### Key Data Flow

```
InputForm (user input)
    ↓
UserProfile object
    ↓
generateAIPlanStreaming()
    ↓ (try AI)
callDeepSeekStreaming() → LLM API
    ↓ (on success)
parseAIResponse() → validateTrainingPlan()
    ↓ (on validation pass)
TrainingPlan with metadata (method: 'ai')
    ↓ (on any failure)
generateRuleBasedPlan() [AUTO FALLBACK]
    ↓
TrainingPlan with metadata (method: 'rule-based', fallbackReason: '...')
    ↓
PlanDisplay (renders final plan)
```

### Core Architecture Components

#### 1. Type System (`src/types/`)
- `index.ts`: Core types (UserProfile, TrainingPlan, Exercise, WorkoutSession, etc.)
- `api.ts`: API-related types (DeepSeekModel, APICallResult, CustomAPIConfig)
- All plans include `GenerationMetadata` to track how they were generated (AI vs rule-based)

#### 2. Data Layer (`src/data/`)
- `exercises.ts`: Exercise database with 100+ exercises categorized by type (warmup, strength_upper/lower/core, cardio, HIIT, stretch)
  - Each exercise has: equipment requirements, contraindications, difficulty level, target muscles
- `templates.ts`: Goal templates, experience modifiers, training splits, periodization strategies
  - Defines ratios for different training types (strength/cardio/HIIT/mobility) per goal
  - Monthly progression: Week 1-3 gradual increase, Week 4 deload
  - Quarterly progression: Month 1-3 stepped intensity increase

#### 3. Generation Logic (`src/lib/`)
- `aiPlanGenerator.ts`: AI generation with streaming support and automatic fallback
- `planGenerator.ts`: Rule-based generation algorithm
  - `generateWeekPlan()`: Creates weekly training structure
  - `generateWorkoutSession()`: Builds individual workouts with 4 phases (warmup/main/accessory/cooldown)
  - Exercise filtering by equipment and constraints (injuries, conditions)
- `deepseekClient.ts`: OpenAI-compatible API client
  - Supports both streaming and non-streaming modes
  - Prioritizes custom API config over environment variables
  - 60s timeout for standard calls, 120s for streaming
- `promptTemplates.ts`: System and user prompts for LLM
- `validators.ts`: AI response validation and completeness checks

#### 4. UI Components (`src/components/`)
- `InputForm.tsx`: User profile input with AI model selection and custom API config
- `PlanDisplay.tsx`: Renders complete training plans (handles both week/month/quarter formats)
- `StreamingDisplay.tsx`: Real-time display of streaming AI generation
- `ReasoningDisplay.tsx`: Shows reasoning process from deepseek-reasoner model
- `ExportButtons.tsx`: Copy text / Download JSON / Print functionality

### Exercise Filtering Logic

The plan generator applies constraint-based filtering in `getAvailableExercises()`:

- **Equipment Filter**: Only selects exercises matching user's available equipment
- **Constraint Filter**: Excludes exercises with contraindications based on user's physical limitations
  - `knee_issue`: Excludes high-impact exercises (jumping, squat jumps)
  - `back_issue`: Excludes heavy deadlifts, deep hip hinge movements
  - `shoulder_issue`: Excludes overhead presses, wide-grip exercises
  - `postpartum`: Prioritizes core rebuilding, low-impact
  - `hypertension`: Avoids heavy breath-holding, focuses medium-low intensity

### Periodization Strategy

Plans use progressive overload via `volumeMultiplier`:

- **Week Plan**: Single week at 1.0x volume
- **Month Plan**: 4-week cycle with varying volume (Foundation → Build → Peak → Deload)
- **Quarter Plan**: 3-month progression, each month uses the 4-week cycle with additional monthly multiplier

### API Configuration

The application supports two ways to configure the DeepSeek API:

1. **Environment Variables** (`.env`):
   ```
   VITE_DEEPSEEK_API_KEY=sk-xxx
   VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com  # Optional, defaults to official API
   ```

2. **Custom User Configuration** (in UI):
   - User can provide their own API key, base URL, and model name at runtime
   - Takes priority over environment variables
   - Useful for self-hosted models or alternative LLM providers

## Working with the Codebase

### Adding New Exercises

Edit `src/data/exercises.ts` and add to the appropriate array:

```typescript
export const upperStrengthExercises: Exercise[] = [
  // existing exercises...
  {
    id: 'upper_new_exercise',
    name: 'New Exercise',
    nameZh: '新动作',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells'],
    targetMuscles: ['chest', 'triceps'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
];
```

### Adding New Training Goals

1. Update `Goal` type in `src/types/index.ts`
2. Add template in `src/data/templates.ts` → `goalTemplates`
3. Add option in `src/components/InputForm.tsx`

### Modifying Generation Logic

- **Rule-based**: Edit `src/lib/planGenerator.ts`
  - Adjust set counts: `createStrengthSet()`
  - Change exercise selection: `selectRandom()` or implement smart selection
  - Modify workout structure: `generateWorkoutSession()`

- **AI prompts**: Edit `src/lib/promptTemplates.ts`
  - `buildSystemPrompt()`: Define AI's role and output format
  - `buildUserPrompt()`: Structure user profile data for LLM

### Testing AI Integration

To test with actual API calls:
1. Create `.env` file with your DeepSeek API key
2. Or use the custom API config in the UI
3. Monitor browser console for detailed API logs
4. Check for automatic fallback to rule-based generation on failures

### Deployment Considerations

- **Static Hosting**: Application is 100% frontend, no server required
- **Recommended Platforms**: Vercel (best), Netlify, GitHub Pages, Cloudflare Pages
- **Build Output**: `dist/` directory after `npm run build`
- **Base Path**: Already configured with `base: './'` in `vite.config.ts` for static hosting
- **Environment Variables**: Set `VITE_DEEPSEEK_API_KEY` in deployment platform's environment config (only if you want to provide a default API key; users can still use custom config)

### Important Notes

- Plans generated by AI are validated against TypeScript types before being displayed
- If AI response fails validation, system automatically falls back to rule-based generation
- All plans include metadata indicating generation method (ai/rule-based) and fallback reasons
- The codebase is bilingual (Chinese/English) - maintain both languages when adding UI text
- Application has NO backend - all logic runs in browser (API calls go directly from client to DeepSeek)

## Common Development Scenarios

### Debugging Plan Generation Issues
1. Check browser console for detailed logs (API calls, parsing, validation)
2. Verify metadata field in generated plan to see if it used AI or rule-based fallback
3. Check `fallbackReason` in metadata if rule-based was used

### Extending API Compatibility
The `deepseekClient.ts` uses OpenAI-compatible format. To support other providers:
1. User can set custom `baseUrl` in UI (e.g., local Ollama instance)
2. Ensure the model returns standard OpenAI response format
3. For streaming, check that SSE format matches expectations

### Customizing Periodization
Edit `src/data/templates.ts`:
- `monthlyProgression`: Adjust 4-week volume/intensity curve
- `quarterlyProgression`: Modify 3-month phased progression
