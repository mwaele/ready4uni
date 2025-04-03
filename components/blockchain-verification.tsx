"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ICP_CONFIG } from "@/lib/icp-config"

interface BlockchainVerificationProps {
  type: "university" | "course"
  id: number
}

export function BlockchainVerification({ type, id }: BlockchainVerificationProps) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState<boolean | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const canisterId = type === "university" ? ICP_CONFIG.UNIVERSITY_CANISTER_ID : ICP_CONFIG.COURSE_CANISTER_ID

  const verifyOnBlockchain = async () => {
    setVerifying(true)

    try {
      // Simulate blockchain verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would call the ICP canister to verify
      setVerified(true)
      setTxHash(`${canisterId}-${Date.now().toString(16)}`)
    } catch (error) {
      console.error("Verification error:", error)
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {verified === null ? (
        <Button variant="outline" size="sm" onClick={verifyOnBlockchain} disabled={verifying}>
          {verifying ? "Verifying..." : "Verify on Blockchain"}
        </Button>
      ) : verified ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Verified on ICP
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transaction Hash: {txHash}</p>
              <p className="text-xs mt-1">Verified on Internet Computer Protocol</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Verification Failed
        </Badge>
      )}
    </div>
  )
}

