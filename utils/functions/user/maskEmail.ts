type User = {
    email: string;
    role: string;
};

export const maskEmail = (user: User, requestingUser: User): string | null => {
    // Check if the requesting user is a staff member with the "Data Protection Officer" role
    if (requestingUser.role === 'Data Protection Officer') {
        return user.email; 
    }

    // Mask the email for other users
    const emailParts = user.email.split('@');
    const maskedEmail = `${emailParts[0].slice(0, 1)}****${emailParts[0].slice(-1)}@${emailParts[1]}`;

    return maskedEmail;
};

