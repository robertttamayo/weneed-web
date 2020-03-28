const filterItemHistory = (item_history, searchTerm, item_filter) => {
    const statusColor = item_filter == 'purchased' ? 'blue' : 'green';
    const filteredList = item_history.filter((item) => {
        if (item_filter == 'all') {
            return item.item_name.toLowerCase().indexOf(searchTerm) != -1;
        } else {
            return item.item_status == statusColor && item.item_name.toLowerCase().indexOf(searchTerm) != -1;
        }
    });
    return filteredList;
};
exports.filterItemHistory = filterItemHistory;