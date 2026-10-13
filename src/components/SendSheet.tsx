import { sending } from "@/lib/copy";

export type SendPhase = "ready" | "quote" | "confirm" | "rest";
export type SendRailId = (typeof sending.rails)[number]["id"];

export function SendSheet({
  rail,
  phase,
  swap = false,
}: {
  rail: SendRailId;
  phase: SendPhase;
  swap?: boolean;
}) {
  const item = sending.rails.find((row) => row.id === rail) ?? sending.rails[0];
  const filled = phase === "quote" || phase === "confirm" || phase === "rest";

  return (
    <div className="send-stage" aria-hidden="true">
      <div
        className={`send-sheet${filled ? " is-quote" : ""}${phase === "confirm" ? " is-confirm" : ""}${swap ? " is-swap" : ""}`}
      >
        <div className="send-sheet-top">
          <span className="send-clock">2:04</span>
          <span className="send-mark">KAST</span>
        </div>

        <p className="send-amount">{item.amount}</p>

        <dl className="send-rows">
          <div className="send-row">
            <dt>To</dt>
            <dd>{item.to}</dd>
          </div>
          <div className="send-row">
            <dt>Rail</dt>
            <dd>{item.rail}</dd>
          </div>
          <div className="send-row">
            <dt>Fee</dt>
            <dd className="send-fill">{item.fee}</dd>
          </div>
          <div className="send-row">
            <dt>Arrives</dt>
            <dd className="send-fill">{item.arrives}</dd>
          </div>
        </dl>

        <div className="send-confirm">Confirm</div>
      </div>
    </div>
  );
}
