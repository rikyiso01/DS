import axios from "axios";

export async function getChallengeFlag(id: number, apiUrl: string) {
  try {
    const resp = await axios.get(apiUrl, {
      params: { id },
      headers: { "api-key": "your_api_key_here" },
    });
    return resp.data.flag;
  } catch (error) {
    console.error(error);
  }
}

export async function getChallengeSolution(id: number, apiUrl: string) {
  try {
    const resp = await axios.get(apiUrl, {
      params: { id },
      headers: { "api-key": "your_api_key_here" },
    });
    return resp.data.solution;
  } catch (error) {
    console.error(error);
  }
}

export async function checkSolutionCorrectness(userSolution: string, challengeSolution: string) {
  return userSolution === challengeSolution;
}
