import React from "react";

// ReCharts
import { VictoryPie, VictoryTheme, VictoryLabel, VictoryContainer } from "victory";

export const Graficos = ({ dataPrint }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
      <VictoryPie
        theme={VictoryTheme.material}
        data={dataPrint}
        labels={({ datum }) => `${datum.x}\n(valor: ${datum.y})`}
        labelComponent={<VictoryLabel angle={360} textAnchor="middle" style={{ fontSize: 10 }} />}
        containerComponent={<VictoryContainer responsive={true} />}
      />
    </div>
  );
};
