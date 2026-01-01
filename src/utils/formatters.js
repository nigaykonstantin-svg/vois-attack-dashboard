// Number and display formatting utilities

export const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
};

export const formatReviews = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
};

export const getPriorityColor = (priority) => {
    if (priority === 'critical') return '#FF4757';
    if (priority === 'high') return '#FFA502';
    if (priority === 'medium') return '#2ED573';
    return '#747D8C';
};

export const getImpactColor = (impact) => {
    if (impact === 'critical') return '#FF4757';
    if (impact === 'high') return '#FFA502';
    return '#2ED573';
};
