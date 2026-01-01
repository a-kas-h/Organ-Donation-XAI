const isBloodTypeCompatible = (donorType, recipientType) => {
    // Standard ABO compatibility map
    // Key: Recipient, Value: Array of compatible Donors
    const compatibilityMap = {
        'O-': ['O-'],
        'O+': ['O-', 'O+'],
        'A-': ['O-', 'A-'],
        'A+': ['O-', 'O+', 'A-', 'A+'],
        'B-': ['O-', 'B-'],
        'B+': ['O-', 'O+', 'B-', 'B+'],
        'AB-': ['O-', 'A-', 'B-', 'AB-'],
        'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    const allowedDonors = compatibilityMap[recipientType];

    // If unknown blood type, default to strict equality or fail
    if (!allowedDonors) {
        return donorType === recipientType;
    }

    return allowedDonors.includes(donorType);
};

module.exports = { isBloodTypeCompatible };
