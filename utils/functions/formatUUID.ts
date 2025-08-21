
export const formatUUID = (uuid: string) => {
    if (!uuid) return ''

    const isGlobal = uuid.endsWith('G')

    if (isGlobal) {
        // Format global UUID: 10000001251029G -> 10-001-251029-G
        const typePrefix = uuid.substring(0, 2)
        const sequence = uuid.substring(5, 8)
        const date = uuid.substring(8, 14)
        return `${typePrefix} ${sequence} ${date}-G`
    } else {
        // Format standard UUID: 291025100000001 -> 29102510-000-001
        const firstPart = uuid.substring(0, 8)
        const secondPart = uuid.substring(8, 11)
        const thirdPart = uuid.substring(11, 14)
        return `${firstPart} ${secondPart} ${thirdPart}`
    }
}

