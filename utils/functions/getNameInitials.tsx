export function getNameInitials(fullName: string) {
  const fullnameArray = fullName?.trim().split(" ");

  if (!fullnameArray || fullnameArray.length === 0) return "";

  if (fullnameArray.length >= 2) {
    return `${fullnameArray[0][0]}${fullnameArray[1][0]}`.toUpperCase();
  } else {
    return `${fullnameArray[0][0]}`.toUpperCase();
  }
}

export function getUserNameInitials(
  firstName: string | undefined,
  lastName: string | undefined
) {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const fullNameArray = fullName.split(" ").filter(Boolean); // Remove any empty strings

  if (fullNameArray.length === 0) return "";

  if (fullNameArray.length >= 2) {
    return `${fullNameArray[0][0]}${fullNameArray[1][0]}`.toUpperCase();
  } else {
    return `${fullNameArray[0][0]}`.toUpperCase();
  }
}
