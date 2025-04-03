import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as universityIdl } from "../declarations/university_canister"
import { idlFactory as courseIdl } from "../declarations/course_canister"
import { idlFactory as aiIdl } from "../declarations/ai_canister"
import { ICP_CONFIG } from "./icp-config"

// Create an agent to talk to ICP
const createAgent = () => {
  return new HttpAgent({
    host: ICP_CONFIG.HOST,
  })
}

// Initialize the agent only once
let agent: HttpAgent | null = null

// Get or create the agent
const getAgent = () => {
  if (!agent) {
    agent = createAgent()
    // In development, we need to fetch the root key
    if (process.env.NODE_ENV !== "production") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Unable to fetch root key. Check your local replica is running")
        console.error(err)
      })
    }
  }
  return agent
}

// Create actors for each canister
export const getUniversityActor = () => {
  return Actor.createActor(universityIdl, {
    agent: getAgent(),
    canisterId: ICP_CONFIG.UNIVERSITY_CANISTER_ID,
  })
}

export const getCourseActor = () => {
  return Actor.createActor(courseIdl, {
    agent: getAgent(),
    canisterId: ICP_CONFIG.COURSE_CANISTER_ID,
  })
}

export const getAiActor = () => {
  return Actor.createActor(aiIdl, {
    agent: getAgent(),
    canisterId: ICP_CONFIG.AI_CANISTER_ID,
  })
}

