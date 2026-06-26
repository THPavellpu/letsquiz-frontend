/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateString - ISO date string (e.g., "2026-06-15T03:09:20.450353Z")
 * @returns {{ date: string, time: string }} - Object with formatted date and time
 */
export function formatDateTime(dateString) {
    if (!dateString || typeof dateString !== "string") {
        return { date: "N/A", time: "N/A" };
    }

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return { date: "N/A", time: "N/A" };
        }

        // Format date as "DD/MM/YY"
        const dateStr = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });

        // Format time as "HH:MM AM/PM"
        const timeStr = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        return { date: dateStr, time: timeStr };
    } catch (e) {
        return { date: "N/A", time: "N/A" };
    }
}