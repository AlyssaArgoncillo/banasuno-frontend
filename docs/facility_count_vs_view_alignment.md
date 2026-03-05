# Facility count vs View panel alignment

The **All Barangays** table shows a "Nearby Facilities" column and a **View** button per row.

**Requirement:** The number of facilities shown in that column (e.g. "5 facilities") must match the number of items listed when the user clicks **View**. The View panel must show exactly that set of facilities for the selected barangay—no more, no less—so that the table and the panel stay in sync.

- **Table:** Display the facility count from the same source used to build the list (e.g. `barangay.facilities` or `getBarangayFacilities(barangay).length`).
- **View panel:** When the user clicks View for a row, render the list from `getBarangayFacilities(barangay)` (or the same API/data that backs the count).

This avoids confusion where the table says "3 facilities" but the panel shows 5, or vice versa.
