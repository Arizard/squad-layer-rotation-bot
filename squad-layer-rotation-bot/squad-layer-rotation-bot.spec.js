jest.mock('squad-server/events');

import LayerRotationPlugin from './squad-layer-rotation-bot.js';
import pluginConfig from './config.js';

const testConfig = {
  ...pluginConfig,
  numberOfChoices: 4,
};

LayerRotationPlugin.config = testConfig;

describe('LayerRotationPlugin Test', () => {
  test('gets layer rotation plugin', () => {
    expect(LayerRotationPlugin).toBeDefined();
    console.log(LayerRotationPlugin);
  });
  test('gets selected allLayers equal to numberOfChoices', () => {
    expect(LayerRotationPlugin.selectLayers().length)
        .toBe(testConfig.numberOfChoices);
  });
  test('selectLayers is typically random between executions', () => {
    let layers = null;
    for (let i = 0; i < 10; i++) {
      const newLayers = LayerRotationPlugin.selectLayers();
      expect(newLayers === layers).toBe(false);
      layers = newLayers;
      console.log(layers);
    }
  });
  test('layersAsChoices works', () => {
    const choices = LayerRotationPlugin.layersAsChoices(
        LayerRotationPlugin.selectLayers(),
    );
    choices.map((choice) => {
      expect(choice.name).toBeDefined();
    });
  });
});
