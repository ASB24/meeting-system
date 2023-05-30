export interface Participante {
    reunionId?: number;
    documento?: any;
    nombres: string;
    tipoDocumento?: string;
    cargo?: string;
    sexo: string;
    institucion?: string;
    telefono?: string;
    correoElectronico?: string;
    estatus: boolean
}