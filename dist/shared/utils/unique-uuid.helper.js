import { v4 as uuidv4 } from "uuid";
export const generateUniqueId = (prefix = "user") => {
    return `trimly-${prefix}-${uuidv4().slice(10)}`;
};
