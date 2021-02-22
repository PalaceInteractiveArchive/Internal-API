import * as Influx from "influx";
import config from '../../config/env';

export const influx: Influx.InfluxDB = new Influx.InfluxDB({
    host: config.influx.host,
    port: config.influx.port,
    username: config.influx.username,
    password: config.influx.password,
    database: config.influx.database,
    schema: [
      {
        measurement: 'player_count',
        fields: {
          count: Influx.FieldType.INTEGER
        },
        tags: [
          'production'
        ]
      }
    ]
});
