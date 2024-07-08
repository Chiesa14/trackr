import { ResourcesConfig } from "aws-amplify";

export const config: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: "af-south-1_x1LUupMIp",
    userPoolClientId: "6qnbjjgggth138i8i056hfj3hd",
    signUpVerificationMethod: "code",
  },
};
