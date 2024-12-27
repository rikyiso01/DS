import axios from "axios";

interface AddChallengeParams {
  name: string;
  description: string;
  category: string;
  flag: string;
  reward: number;
  problem: string;
  solution: string;
  toast: any;
}

export async function addChallenge({
  name,
  description,
  category,
  flag,
  reward,
  problem,
  solution,
  toast,
}: AddChallengeParams) {
  try {
    // 1) Possibly pin to IPFS (via Pinata) => get IPFS hash
    // 2) Interact with your contract if you like (like `contract.addChallenge(...)`)
    // 3) Save the cleartext flag to your backend
    const apiUrl = import.meta.env.VITE_API_URL || "https://example.com/api";
    const resp = await axios.post(apiUrl, {
      name,
      description,
      category,
      flag,
      reward,
      problem,
      solution,
    }, {
      headers: { "api-key": "your_api_key_here" },
    });
    console.log(resp.data);
    toast({
      title: "Challenge added",
      description: "Challenge saved successfully",
    });
  } catch (error) {
    console.error(error);
    toast({
      title: "Error adding challenge",
      description: String(error),
    });
  }
}
