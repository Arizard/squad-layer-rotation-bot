import {layersAsChoices, randomElements} from './SquadLayerRotationBot';

jest.mock('squad-server/events');
jest.mock('core/squad-layers');

import LayerRotationPlugin from './SquadLayerRotationBot';

const testConfig = {
  numberOfChoices: 4,
};

const sampleLayers = [
  {
    'layer': 'Al Basrah AAS v1',
    'map': 'Al Basrah',
    'layerClassname': 'Albasrah_AAS_v1',
    'mapSize': '2x2 km',
    'gamemode': 'AAS',
    'version': 'v1',
    'lighting': 'Sunny Mid Day',
    'info': null,
    'commander': true,
    'flagCount': 7,
    'teamOne': {
      'faction': 'USA',
      'tickets': '250',
    },
    'teamTwo': {
      'faction': 'MEA',
      'tickets': '250',
    },
    'tanks': 'N/A',
    'helicopters': 'N/A',
    'newForVersion': false,
    'estimatedSuitablePlayerCount': {
      'min': 36,
      'max': 100,
    },
  },
  {
    'layer': 'Al Basrah AAS v2',
    'map': 'Al Basrah',
    'layerClassname': 'Albasrah_AAS_v2',
    'mapSize': '2x2 km',
    'gamemode': 'AAS',
    'version': 'v2',
    'lighting': 'Sunny Mid Day',
    'info': null,
    'commander': true,
    'flagCount': 7,
    'teamOne': {
      'faction': 'USA',
      'tickets': '250',
    },
    'teamTwo': {
      'faction': 'INS',
      'tickets': '250',
    },
    'tanks': 'N/A',
    'helicopters': 'x3 for USA',
    'newForVersion': false,
    'estimatedSuitablePlayerCount': {
      'min': 45,
      'max': 100,
    },
  },
  {
    'layer': 'Al Basrah Insurgency v1',
    'map': 'Al Basrah',
    'layerClassname': 'Albasrah_Insurgency_v1',
    'mapSize': '2x2 km',
    'gamemode': 'Insurgency',
    'version': 'v1',
    'lighting': 'Sunrise',
    'info': null,
    'commander': true,
    'flagCount': 0,
    'teamOne': {
      'faction': 'GB',
      'tickets': '200',
    },
    'teamTwo': {
      'faction': 'INS',
      'tickets': '600',
    },
    'tanks': 'N/A',
    'helicopters': 'x1 for GB, 20min delay',
    'newForVersion': false,
    'estimatedSuitablePlayerCount': {
      'min': 54,
      'max': 100,
    },
  },
  {
    'layer': 'Al Basrah Invasion v1',
    'map': 'Al Basrah',
    'layerClassname': 'Albasrah_Invasion_v1',
    'mapSize': '2x2 km',
    'gamemode': 'Invasion',
    'version': 'v1',
    'lighting': 'Sunrise',
    'info': 'Random',
    'commander': true,
    'flagCount': 6,
    'teamOne': {
      'faction': 'GB',
      'tickets': '200',
    },
    'teamTwo': {
      'faction': 'INS',
      'tickets': '900',
    },
    'tanks': 'N/A',
    'helicopters': 'x1 for GB, 20min delay',
    'newForVersion': false,
    'estimatedSuitablePlayerCount': {
      'min': 54,
      'max': 100,
    },
  },
];

describe('LayerRotationPlugin Test', () => {
  test('gets layer rotation plugin', () => {
    expect(LayerRotationPlugin).toBeDefined();
    console.log(LayerRotationPlugin);
  });
  test('gets randomElements equal to numberOfChoices', () => {
    expect(
        randomElements(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            testConfig.numberOfChoices,
        ).length,
    ).toBe(testConfig.numberOfChoices);
  });
  test('randomElements is typically random between executions', () => {
    let elements = null;
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < 10; i++) {
      const newElements = randomElements(pool);
      expect(newElements == elements).toBe(false);
      elements = newElements;
    }
  });
  test('layersAsChoices works', () => {
    const choices = layersAsChoices(
        randomElements(sampleLayers, testConfig.numberOfChoices),
    );
    choices.map((choice) => {
      expect(choice.name).toBeDefined();
    });
  });
});
