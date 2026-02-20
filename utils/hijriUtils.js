// Utility to handle Hijri Dates using Intl API

export function getHijriDate(date = new Date()) {
    try {
        return new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(date);
    } catch (e) {
        console.error("Hijri Date Error:", e);
        return "Date Unavailable";
    }
}

export function getHijriMonthName(date = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
            month: 'long',
        }).formatToParts(date);
        return parts.find(p => p.type === 'month')?.value;
    } catch (e) {
        return "";
    }
}

export const ISLAMIC_EVENTS = [
    { name: 'Islamic New Year', month: 1, day: 1, description: '1st Muharram' },
    { name: 'Ashura', month: 1, day: 10, description: '10th Muharram' },
    { name: 'Mawlid al-Nabi', month: 3, day: 12, description: '12th Rabi al-Awwal' },
    { name: 'Isra and Mi\'raj', month: 7, day: 27, description: '27th Rajab' },
    { name: 'Mid-Sha\'ban', month: 8, day: 15, description: '15th Sha\'ban' },
    { name: 'Ramadan Starts', month: 9, day: 1, description: '1st Ramadan' },
    { name: 'Laylat al-Qadr', month: 9, day: 27, description: '27th Ramadan (approx)' },
    { name: 'Eid al-Fitr', month: 10, day: 1, description: '1st Shawwal' },
    { name: 'Day of Arafah', month: 12, day: 9, description: '9th Dhul-Hijjah' },
    { name: 'Eid al-Adha', month: 12, day: 10, description: '10th Dhul-Hijjah' },
];

export function getUpcomingEvents() {
    // This is a simplified logic. 
    // Real logic would need to parse the current Hijri month/day from Intl parts and compare.
    // For now, we just return the static list for display.
    return ISLAMIC_EVENTS;
}

// ---------------------------------------------------------
// NEW: Calendar Grid Logic relying on Intl Probing
// ---------------------------------------------------------

// Helper to get raw Hijri parts { day, month, year, monthName }
function getHijriParts(date) {
    try {
        const parts = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).formatToParts(date);

        const day = parts.find(p => p.type === 'day')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const year = parts.find(p => p.type === 'year')?.value;

        return { day, month, year };
    } catch (e) {
        return { day: '', month: '', year: '' };
    }
}

// Basic mapping of Hijri Month Names (standard English) to Month Numbers (1-12)
const HIJRI_MONTHS_MAP = {
    'Muharram': 1,
    'Safar': 2,
    'Rabiʻ I': 3, 'Rabi al-Awwal': 3,
    'Rabiʻ II': 4, 'Rabi al-Thani': 4,
    'Jumada I': 5, 'Jumada al-Awwal': 5,
    'Jumada II': 6, 'Jumada al-Thani': 6,
    'Rajab': 7,
    'Shaʻban': 8, 'Shaban': 8,
    'Ramadan': 9,
    'Shawwal': 10,
    'Dhuʻl-Qiʻdah': 11, 'Dhul-Qadah': 11,
    'Dhuʻl-Hijjah': 12, 'Dhul-Hijjah': 12
};

// Helper to normalize month name and get index
function getMonthIndex(name) {
    if (!name) return -1;
    // Simple normalization to handle potential Intl variations
    // This is not exhaustive but covers standard 'en-TN-u-ca-islamic-umalqura'
    for (const [key, value] of Object.entries(HIJRI_MONTHS_MAP)) {
        if (name.includes(key) || key.includes(name)) return value;
    }
    return -1;
}

// Get the full grid for the Hijri month containing `baseDate`
export function getHijriMonthGrid(baseDate = new Date()) {
    const currentParts = getHijriParts(baseDate);
    const targetMonth = currentParts.month;
    const targetYear = currentParts.year;

    const targetMonthIndex = getMonthIndex(targetMonth);

    // 1. Find the START of the month
    // We iterate backwards from baseDate until the month changes
    let startDate = new Date(baseDate);
    while (true) {
        const prevDay = new Date(startDate);
        prevDay.setDate(prevDay.getDate() - 1);
        const parts = getHijriParts(prevDay);
        if (parts.month !== targetMonth) break;
        startDate = prevDay;
    }

    // 2. Find the END of the month
    // We iterate forwards from baseDate until the month changes
    let endDate = new Date(baseDate);
    while (true) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const parts = getHijriParts(nextDay);
        if (parts.month !== targetMonth) break;
        endDate = nextDay;
    }

    // 3. Build the Grid
    // We need to know the Gregorian weekday of startDate to pad the start
    const startWeekday = startDate.getDay(); // 0 = Sunday, 1 = Monday...

    const days = [];

    // Pad initial empty slots
    for (let i = 0; i < startWeekday; i++) {
        days.push(null);
    }

    // Fill days
    let iterDate = new Date(startDate);
    while (iterDate <= endDate) {
        const parts = getHijriParts(iterDate);

        // CHECK FOR EVENTS
        let event = null;
        const currentMonthIdx = getMonthIndex(parts.month);
        if (currentMonthIdx !== -1) {
            event = ISLAMIC_EVENTS.find(e => e.month === currentMonthIdx && e.day === parseInt(parts.day));
        }

        days.push({
            hijriDay: parts.day,
            gregorianDate: new Date(iterDate), // Clone
            isToday: isSameDay(iterDate, new Date()),
            parts: parts, // { day, month, year }
            event: event
        });
        iterDate.setDate(iterDate.getDate() + 1);
    }

    return {
        monthName: targetMonth,
        year: targetYear,
        days,
        startDate, // Useful for navigation (subtract 1 day to go to prev month)
        endDate    // Useful for navigation (add 1 day to go to next month)
    };
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}
