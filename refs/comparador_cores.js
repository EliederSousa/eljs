import fs from "fs";

// === Funções utilitárias ===
function distanciaEuclidiana(corA, corB) {
    const [r1, g1, b1] = corA;
    const [r2, g2, b2] = corB;
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function hexToRGB(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function parseRGBString(str) {
    const match = str.match(/\d+/g);
    return match ? match.map(Number) : null;
}

function normalizarEntrada(cor) {
    if (Array.isArray(cor)) return cor;
    if (typeof cor === "string" && cor.startsWith("#")) return hexToRGB(cor);
    if (typeof cor === "string" && cor.startsWith("rgb")) return parseRGBString(cor);
    throw new Error("Formato de cor inválido");
}

// === Importa a classe com as cores ===
import { ColorsReference } from "./cores.js";

// Pega o objeto real de cores (cores.colors)
const allColors = {
    ...ColorsReference.colors.W3C,
    ...Object.fromEntries(Object.entries(ColorsReference.colors).filter(([k]) => k !== "W3C"))
};

// Cor de referência (preto)
const referencia = [0, 0, 0];

// === Calcula distâncias euclidianas ===
const distancias = {};
for (const [nome, rgb] of Object.entries(allColors)) {
    distancias[nome] = distanciaEuclidiana(rgb, referencia);
}

// === Função principal: encontra cor mais próxima ===
function corMaisProxima(input) {
    const entradaRGB = normalizarEntrada(input);

    let menorDist = Infinity;
    let corMaisProx = null;

    for (const [nome, rgb] of Object.entries(allColors)) {
        const dist = distanciaEuclidiana(entradaRGB, rgb);
        if (dist < menorDist) {
            menorDist = dist;
            corMaisProx = nome;
        }
    }

    return corMaisProx;
}