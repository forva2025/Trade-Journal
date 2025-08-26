# Trade Journal

A web-based application to help you track your trading performance with detailed, multimedia-rich notes.

## Features

*   **Log New Trades:** Easily record new trades with the following details:
    *   **Trade Title:** A descriptive name for your trade.
    *   **Description:** Detailed notes about the trade setup, execution, and outcome.
    *   **Symbol:** The ticker symbol of the asset traded.
    *   **Entry and Exit Prices:** The prices at which you entered and exited the trade.
    *   **Trade Date:** The date of the trade.
*   **Multimedia Attachments:** Enhance your trade logs by attaching:
    *   **Images:** Screenshots of your charts or trade setups.
    *   **Voice Notes:** Record your thoughts and analysis.
    *   **Videos:** Capture screen recordings of your trading session.
*   **Dynamic Trade List:** View all your logged trades in a clean, card-based layout.
*   **Search and Filter:** Quickly find specific trades using:
    *   **Search:** Look up trades by symbol or title.
    *   **P&L Filter:** Filter trades to show only profitable or losing trades.
    *   **Date Filter:** View all trades from a specific date.
*   **Calculated P&L:** The application automatically calculates the Profit and Loss (P&L) for each trade.
*   **Modern UI:** A clean and responsive user interface built with Tailwind CSS, featuring hover animations and a glassmorphism effect.

## Technologies Used

*   **Frontend:**
    *   HTML5
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   JavaScript
*   **Backend (Planned):**
    *   [Supabase](https://supabase.io/) for database and file storage.
*   **Icons:**
    *   [Font Awesome](https://fontawesome.com/)

## How to Use

1.  Open the `index.html` file in your web browser.
2.  The application will load with sample trade data for demonstration.
3.  Use the "Log New Trade" form on the left to enter the details of your trade.
4.  Attach any relevant media (images, voice notes, or videos).
5.  Click "Save Trade" to add it to your journal.
6.  Use the search and filter options to navigate through your trade history.

## Future Development

This application is designed to be integrated with Supabase for a full-fledged backend. The following features are planned:

*   **User Authentication:** Securely log in to access your private trade journal.
*   **Database Integration:** Store and retrieve trade data from a Supabase PostgreSQL database.
*   **Cloud Media Storage:** Upload and store your media files in Supabase Storage.
*   **Data Persistence:** All your trade data will be saved and available across sessions.