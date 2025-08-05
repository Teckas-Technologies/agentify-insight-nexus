import { usePrivy } from '@privy-io/react-auth';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/transactions`;

export function useTransactions() {
    const { user, getAccessToken } = usePrivy();
    const { address } = useAccount();

    const getstats = useCallback(async (userId: string, privyId: string) => {
        try {
            const query = new URLSearchParams({
                user_id: userId,
                privy_id: privyId
            });

            const accessToken = await getAccessToken();
            console.log("Access Token:", accessToken);

            const res = await fetch(`${API_BASE}/stats?${query.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return await res.json();
        } catch (error) {
            console.error("Error fetching stats:", error);
            return null;
        }
    }, [getAccessToken]);

    const getTransactions = useCallback(async (userId: string, privyId: string, skip: number = 0, limit: number = 10) => {
        try {
            const params = new URLSearchParams({
                user_id: userId,
                privy_id: privyId,
                skip: skip.toString(),
                limit: limit.toString(),
            });

            const accessToken = await getAccessToken();

            const res = await fetch(`${API_BASE}/?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return await res.json();
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return null;
        }
    }, [getAccessToken]);

    return {
        getstats,
        getTransactions
    };
}
