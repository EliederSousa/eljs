import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Item } from "./Item.js";

// ─────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────

/**
 * Configuração aceita pelo construtor de `Shape`.
 * Subclasses podem estender esta interface adicionando seus próprios campos
 * (ex: `radius` em `CircleObject`, `width`/`height` em `RectangleObject`).
 */
export interface ShapeConfig {
  /** Nome do tipo, ex: "Circle", "Square". Padrão: "Shape". */
  type?: string;

  /** Tempo máximo de vida em ms. `null` = sem limite. */
  maxTime?: number | null;

  /** Ângulo de rotação em graus. Padrão: 0. */
  rotation?: number;

  /** Se `false`, o shape não é desenhado. Padrão: true. */
  visible?: boolean;

  /** Cor de preenchimento. Padrão: branco opaco. */
  color?: Color | null;

  /** Cor do contorno. Se ausente, contorno não é desenhado. */
  lineColor?: Color;

  /** Espessura do contorno em pixels. */
  lineWidth?: number;

  /**
   * Lista de vértices pré-calculados.
   * Toda subclasse deve fornecer seus vértices no construtor
   * e mantê-los atualizados via `updateVertices()`.
   */
  vertices?: Point[];
}

// ─────────────────────────────────────────────
// Classe Shape
// ─────────────────────────────────────────────

/**
 * Shape — classe base para todos os objetos visuais da cena.
 *
 * Herda de `Item` (identidade + ciclo de vida) e adiciona tudo que é
 * comum a qualquer forma geométrica: posição, rotação, cor, contorno,
 * modo de desenho e vértices.
 *
 * Subclasses obrigatórias: `CircleObject`, `SquareObject`, `RectangleObject`,
 * `LineObject`, etc.
 *
 * @example
 * // Nunca instancie Shape diretamente — use uma subclasse:
 * const circle = new CircleObject(pos, { radius: 20, drawMode: "CENTER" });
 */
export abstract class Shape extends Item {

  /** Posição do shape na cena (interpretada conforme `drawMode`). */
  position: Point;

  /** Ângulo de rotação em graus. */
  rotation: number;

  /** Controla se o shape será desenhado no frame atual. */
  visible: boolean;

  /** Cor de preenchimento. */
  color: Color | null;

  /** Cor do contorno. `undefined` = sem contorno. */
  lineColor?: Color;

  /** Espessura do contorno em pixels. `undefined` = sem contorno. */
  lineWidth?: number;

  /**
   * Vértices do shape em coordenadas de mundo.
   * Calculados a partir de `position` + propriedades geométricas (raio, tamanho…).
   * Sempre atualizados antes de desenhar via `updateVertices()`.
   */
  vertices: Point[];

  /**
   * @param position - Ponto de origem do shape na cena.
   * @param conf     - Configuração do shape. Veja `ShapeConfig`.
   * @throws Se `position` não for instância de `Point`.
   * @throws Se `conf` não for um objeto válido.
   * @throws Se `conf.drawMode` não for um valor de `Shape.drawModes`.
   * @throws Se `conf.vertices` não for fornecido.
   */
  constructor(position: Point, conf: ShapeConfig) {
    if (!(position instanceof Point)) {
      throw new Error("Shape::constructor: position não é instância da classe Point.");
    }

    super({ type: conf.type ?? "Shape", maxTime: conf.maxTime });

    this.position = position;
    this.rotation = conf.rotation ?? 0;
    this.visible = conf.visible ?? true;
    this.color = conf.color ?? null;
    this.lineColor = conf.lineColor;
    this.lineWidth = conf.lineWidth;

    if (!conf.vertices) {
      throw new Error("Shape::constructor: não foi passado um Array de vértices válido.");
    }
    this.vertices = conf.vertices;
  }

  // ─────────────────────────────────────────────
  // Métodos abstratos — obrigatórios nas subclasses
  // ─────────────────────────────────────────────

  /**
   * Recalcula `this.vertices` com base na posição e geometria atuais.
   * Deve ser chamado antes de qualquer operação que dependa de vértices
   * (colisão, desenho, cálculo de centro).
   *
   * @throws Erro se a subclasse não implementar.
   */
  abstract updateVertices(): void;

  /**
   * Desenha o shape no canvas.
   * Toda subclasse deve implementar sua própria lógica de renderização.
   *
   * @param canvas_context - Contexto 2D do canvas.
   * @throws Erro se a subclasse não implementar.
   */
  abstract draw(canvas_context: CanvasRenderingContext2D): void;

  // ─────────────────────────────────────────────
  // Métodos concretos
  // ─────────────────────────────────────────────

  /**
   * Cria uma cópia deste shape, opcionalmente em uma nova posição.
   * Chama `_localClone()` para que subclasses adicionem seus campos extras
   * (ex: `radius`, `size`) ao objeto de configuração antes da clonagem.
   *
   * @param newposition - Nova posição. Se omitida, usa a posição atual.
   * @returns Nova instância do mesmo tipo de shape.
   */
  clone(newposition?: Point): this {
    const conf: ShapeConfig = {
      type: this.type,
      rotation: this.rotation,
      visible: this.visible,
      color: this.color?.clone(),
      lineColor: this.lineColor?.clone(),
      lineWidth: this.lineWidth,
      vertices: this.vertices.map(v => v.clone()),
    };
    const pos = newposition ? newposition.clone() : this.position.clone();
    this._localClone(conf);
    const ctor = this.constructor as new (pos: Point, conf: ShapeConfig) => this;
    return new ctor(pos, conf);
  }

  /**
   * Hook chamado por `clone()` para que subclasses injetem seus campos
   * específicos no objeto de configuração antes de criar a cópia.
   *
   * @example
   * // Em CircleObject:
   * protected _localClone(conf: ShapeConfig) {
   *   (conf as CircleConfig).radius = this.radius;
   * }
   */
  protected _localClone(conf: ShapeConfig): void { }

  /**
   * Calcula e retorna o centro geométrico do shape
   * como média dos seus vértices.
   * Se não houver vértices, retorna uma cópia de `position`.
   */
  getCenter(): Point {
    if (!this.vertices || this.vertices.length === 0) {
      return this.position.clone();
    }
    const sumX = this.vertices.reduce((acc, v) => acc + v.x, 0);
    const sumY = this.vertices.reduce((acc, v) => acc + v.y, 0);
    return new Point(sumX / this.vertices.length, sumY / this.vertices.length);
  }


  protected drawVertices(canvas_context: CanvasRenderingContext2D): void {
    canvas_context.save();

    // ================================================================
    // = Inicio do desenho da forma: itera sobre cada vértice
    // ================================================================
    canvas_context.beginPath();
    // 1. Move o ponteiro para o primeiro vértice
    canvas_context.moveTo(this.vertices[0].x, this.vertices[0].y);
    // 2. Desenha uma linha passando por cada vértice
    for (let i = 1; i < this.vertices.length; i++) {
      canvas_context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    // 3. Fecha o polígono
    canvas_context.closePath();
    // ================================================================


    // ================================================================
    // = Preenche e colore caso necessário.
    // ================================================================
    if (this.color) {
      if (this.color.constructor.name === "GradientColor") {
        // Gradiente radial: usado para efeitos de partículas/luz
        canvas_context.globalCompositeOperation = "lighter";
        const gradient = canvas_context.createRadialGradient(
          this.position.x, this.position.y, 1,
          this.position.x, this.position.y,
          (this as any).radius - (this.color as any).radiusOffset
        );
        (this.color as any).colors.forEach((color: Color, step: number) => {
          gradient.addColorStop(step / ((this.color as any).colors.length - 1), color.CSS);
        });
        canvas_context.fillStyle = gradient;
      } else {
        canvas_context.fillStyle = (this.color as any).CSS ?? (this.color as any);
      }
      canvas_context.fill();
    }

    // ================================================================
    // Evidencia o contorno da forma caso necessário
    // ================================================================
    if (this.lineColor) {
      canvas_context.strokeStyle = (this.lineColor as any).CSS ?? (this.lineColor as any);
      canvas_context.lineWidth = this.lineWidth ?? 1;
      canvas_context.stroke();
    }

    canvas_context.restore();
  }
}