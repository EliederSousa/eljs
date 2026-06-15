/**
 * Global static flags and configuration values.
 *
 * Toggle these at runtime to control debug overlays, physics limits,
 * and rendering behaviour across the entire scene.
 */
export class Properties {
    // ================================================================
    // Parâmetros do World
    // ================================================================

    // Simula uma tela circular: elementos que saem por um lado aparecem no outro.
    static circularScreen = true;

    // Ativa uma caixa de debug com informações de FPS, mouse, teclas pressionadas, etc.
    static debugBox = true;

    // Desenha linhas de debug para aceleração e velocidade em objetos Movable.
    static velocityLine = true;
    static velocityLineScale = .2;
    static accelerationLineScale = 1;

    // Mostra emmiters.
    static debugEmmiters = false;

    // ================================================================
    // Propriedades de física padrão
    // ================================================================

    static maxVelocity = 2000;          // Máxima velocidade de qualquer objeto Movable
    static damping = 0.999;             // Velocidade de decaimento: quanto maior, mais atrito com o ar

    static frictionSensibility = 2;      // Valor mínimo de velocidade tangente para aplicar velocidade horizontal
    static positionalCorrectionPercent = .5;    // Porcentagem de correção posicional. Maior é mais forçado.
    // Margem de erro: se objetos estiverem se tocando mas a penetração for menor que isso, não force o afastamento.
    static positionalCorrectionSlop = .5;

    static rotationSensitivity = .1;    // Valor mínimo que uma força deve ter para rotacionar um objeto. Menor que isso impede rotação
    static solverIterations = 8;        // Quantidade de iterações pelas quais o solver passa, por frame.

    // ================================================================
    // Valores padrão para forças
    // ================================================================

    static gravity = 12;
    static wind = 0;

    // ================================================================
    // Valores padrão para objetos Movable
    // ================================================================

    static defaultMass = 1;                 // Valor padrão de massa
    static defaultRestitution = 0.4;        // Valor padrão de restitution (elasticidade) dos objetos.
    static defaultFriction = 0.2;           // Valor padrão de frição dos objetos.
    static defaultRotationDecay = 0.99;     // Valor padrão que é multiplicado pelo velRotation para reduzir a rotação.
    static defaultMinimumRotation = 0.001;  // Um MovableObject não rotacionará se seu velRotation for menor que este valor.
}
