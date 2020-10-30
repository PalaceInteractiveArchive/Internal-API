export enum Rank {
    OWNER = 17,
    DIRECTOR = 17,
    MANAGER = 17,
    LEAD = 17,
    DEVELOPER = 17,
    COORDINATOR = 16,
    BUILDER = 15,
    TECHNICIAN = 14,
    MEDIA = 13,
    MOD = 12,
    TRAINEETECH = 11,
    TRAINEEBUILD = 10,
    TRAINEE = 9,
    CHARACTER = 8,
    SPECIALGUEST = 7,
    SHAREHOLDER = 6,
    HONORABLE = 5,
    MAJESTIC = 4,
    NOBLE = 3,
    DWELLER = 2,
    SETTLER = 1
}

export namespace Rank {
    export function fromString(rank: string): Rank {
        switch (rank.toLowerCase()) {
            case 'settler':
                return Rank.SETTLER;
            case 'dweller':
                return Rank.DWELLER;
            case 'noble':
                return Rank.NOBLE;
            case 'majestic':
                return Rank.MAJESTIC;
            case 'honorable':
                return Rank.HONORABLE;
            case 'shareholder':
                return Rank.SHAREHOLDER;
            case 'specialguest':
                return Rank.SPECIALGUEST;
            case 'character':
                return Rank.CHARACTER;
            case 'trainee':
                return Rank.TRAINEE;
            case 'traineebuild':
                return Rank.TRAINEEBUILD;
            case 'traineetech':
                return Rank.TRAINEETECH;
            case 'mod':
                return Rank.MOD;
            case 'media':
                return Rank.MEDIA;
            case 'technician':
                return Rank.TECHNICIAN;
            case 'builder':
                return Rank.BUILDER;
            case 'coordinator':
                return Rank.COORDINATOR;
            case 'developer':
                return Rank.DEVELOPER;
            case 'lead':
                return Rank.LEAD;
            case 'manager':
                return Rank.MANAGER;
            case 'director':
                return Rank.DIRECTOR;
            case 'owner':
                return Rank.OWNER;
            default:
                return Rank.SETTLER;
        }
    }
}