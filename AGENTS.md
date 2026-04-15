AI agents must follow the rules below:

1. The agent must always generate an explicit plan before taking any action.  
   The plan must include the intended steps, the reasoning behind them, and any assumptions or dependencies.  
   The agent must not execute the task until this plan is completed.

2. When additional context or specifications are required, the agent must consult the relevant materials under the `docs/` directory and reference them in the plan.

3. After producing the plan, the agent may proceed with execution.  
   Execution must follow the planned steps, and any deviations must be clearly justified.

4. All outputs must be written in Markdown unless otherwise specified.
