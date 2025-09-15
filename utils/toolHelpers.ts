import { Tool, ToolsMap } from "../types/tool";

const getAllTools = (tools: ToolsMap): Tool[] => Object.values(tools).filter(Boolean);

const getToolsByCategory = (tools: ToolsMap): Record<Tool["category"], Tool[]> => {
    const toolsArray = getAllTools(tools);
    const grouped: Record<string, Tool[]> = {};

    toolsArray.forEach((tool: Tool) => {
        if (tool && tool.category) {
            if (!grouped[tool.category]) {
                grouped[tool.category] = [];
            }
            grouped[tool.category].push(tool);
        }
    });

    return grouped;
}

export { getToolsByCategory };
