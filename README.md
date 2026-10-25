A calculator featuring the four fundamental arithmetic operations (Addition, Subtraction, Multiplication, and Division) has been built using Vue 3, Vuetify 3, and Vuelidate.

## Key Features

### 1. Standard Tactile Keypad
- **Ergonomic design:** High-contrast keypad with digital display, sub-expression formula preview, and tabular numeral readout.
- **Core operations:** $+$, $-$, $\times$, $\div$, negation $\pm$, percentage $\%$, and reciprocal $1/x$.
- **Division-by-zero safeguard:** Real-time warnings that prevent undefined operations.
- **Dedicated memory register:** `MC`, `MR`, `M+`, `M-`, and `MS` with an active memory indicator.
- **Comprehensive physical keyboard support:** `0-9`, `+`, `-`, `*`, `/`, `Enter`/`=`, `Backspace`, `Escape`.

### 2. Vuelidate Arithmetic Form
- **Step-by-step evaluation:** Formula evaluation using `@vuelidate/core` and `@vuelidate/validators`.
- **Custom validators:** Floating-point sanity, size limits, and division-by-zero prevention (`notZeroIfDivision`).
- **Live Vuelidate schema inspector:** Displays `dirty`, `valid`, `error`, and `pending` statuses alongside inline error messages.
- **Mathematical decomposition:** Breaks down quotient, remainder, mixed fractions, multiplicands, and commutative properties.
- **Quick presets:** One-click calculation presets.

### 3. Real-World Four-Operation Tools
- **Bill Split & Tip:** Combines multiplication (tip calculation), addition (total bill), and division (per-person share) with Vuelidate checks.
- **Percentage Shift & Margin:** Calculates differences via subtraction and relative shift via division.

### 4. Calculation Audit Tape
- **Session logging:** Chronological tape logging expressions, operations, timestamps, and results.
- **Tape management:** Filter by operation ($+$, $-$, $\times$, $\div$), one-click load back into Keypad, copy to clipboard, and text tape export.

### 5. Design & UX Controls
- **Material Design 3:** Theme system with instant Light/Dark mode switcher.
- **Audio feedback:** Optional synthetic audio click feedback powered by the Web Audio API.
- **Help reference:** Keyboard shortcuts reference dialog.
