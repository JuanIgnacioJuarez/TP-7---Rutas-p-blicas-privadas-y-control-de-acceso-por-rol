export class Participante {
    id?: number;
    nombre: string;
    email: string;
    edad: number;
    pais: string;
    nivel: string;
    modalidad: string;
    tecnologias: string[];
    aceptaTerminos: boolean;

    constructor(
        nombre: string,
        email: string,
        edad: number,
        pais: string,
        nivel: string,
        modalidad: string,
        tecnologias: string[],
        aceptaTerminos: boolean
    ) {
        this.nombre = nombre;
        this.email = email;
        this.edad = edad;
        this.pais = pais;
        this.nivel = nivel;
        this.modalidad = modalidad;
        this.tecnologias = tecnologias;
        this.aceptaTerminos = aceptaTerminos;
    }
}