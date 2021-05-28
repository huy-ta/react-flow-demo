import React, { useEffect, useRef } from 'react';

import IntentNode from './nodes/IntentNode/IntentNode';
import StartNode from './nodes/StartNode/StartNode';
import ConditionNode from './nodes/ConditionNode/ConditionNode';
import ActionNode from './nodes/ActionNode/ActionNode';
import TerminateNode from './nodes/TerminateNode/TerminateNode';

import {
  DraggableReactFlowy,
  ReactFlowyProps,
  BackgroundVariant,
  Background,
  Elements,
  getSelectedElement,
  getOutEdges,
  useReactFlowyStore,
  nodesSelector,
  edgesSelector,
  Node,
  Edge,
} from 'react-flowy/lib';
import Toolbar from './toolbar/Toolbar';
import EdgeWithContextMenu from './edges/EdgeWithContextMenu';
import { registerNodeDropValidator } from './sidebar/DraggableBlock';

const nodeTypes = {
  startNode: StartNode,
  intentNode: IntentNode,
  conditionNode: ConditionNode,
  actionNode: ActionNode,
  terminateNode: TerminateNode,
};

const edgeTypes = {
  standardEdge: EdgeWithContextMenu,
};

const graphElements: Elements = [
  {
    id: '0',
    type: 'startNode',
    position: {
      x: 80,
      y: 80,
    },
  },
  {
    id: '1',
    type: 'intentNode',
    data: {
      intent: 'ATM Locations',
    },
    position: {
      x: 80,
      y: 400,
    },
  },
  {
    id: '2',
    type: 'conditionNode',
    data: {
      conditions: [
        {
          parameter: '@sys.geo_district',
          operator: '!=',
          value: 'NULL',
        }
      ],
    },
    position: {
      x: 480,
      y: 200,
    },
  },
  {
    id: '3',
    type: 'actionNode',
    data: {
      action: 'ATM Locations',
    },
    position: {
      x: 1120,
      y: 200,
    },
  },
  {
    id: '4',
    type: 'terminateNode',
    position: {
      x: 640,
      y: 600,
    },
  },
];

const Workflow = () => {
  const nodes = useRef<Node[]>([]);
  const edges = useRef<Edge[]>([]);
  const unselectAllElements = useReactFlowyStore(state => state.unselectAllElements);
  const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
  const registerNodeValidator = useReactFlowyStore(state => state.registerNodeValidator);
  const setElements = useReactFlowyStore(state => state.setElements);

  useEffect(() => {
    useReactFlowyStore.subscribe(edgesFromStore => {
      edges.current = edgesFromStore;
    }, edgesSelector);

    useReactFlowyStore.subscribe(nodesFromStore => {
      nodes.current = nodesFromStore;
    }, nodesSelector);
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return unselectAllElements();

    if (e.key === 'Delete') {
      const selectedElement = getSelectedElement();

      if (selectedElement) {
        deleteElementById(selectedElement.id);
      }
    }
  }

  const handleLoad: ReactFlowyProps['onLoad'] = (reactFlowInstance) => {
    console.log(reactFlowInstance.toObject());
    setElements(graphElements);

    registerNodeValidator('intentNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode')
        return { isValid: false, reason: 'Invalid target node' };

      const outcomingEdges = getOutEdges(sourceNode).filter(edge => edge.target !== targetNode.id);
      const firstConnectedNode = nodes.current.find(node => node.id === outcomingEdges[0].target);

      if ((firstConnectedNode?.type === 'conditionNode' && targetNode.type !== 'conditionNode') ||
        (firstConnectedNode?.type === 'actionNode')
      )
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeValidator('conditionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'startNode' || targetNode.type === 'intentNode')
        return { isValid: false, reason: 'Invalid target node' };

      return { isValid: true };
    });

    registerNodeValidator('actionNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'startNode' || targetNode.type === 'conditionNode')
        return { isValid: false, reason: 'Invalid target node' };

      if (getOutEdges(sourceNode).length > 1)
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeValidator('startNode')((sourceNode, targetNode) => {
      if (targetNode.id === sourceNode.id || targetNode.type === 'terminateNode' || targetNode.type === 'conditionNode')
        return { isValid: false, reason: 'Invalid target node' };

      if (getOutEdges(sourceNode).length > 1)
        return { isValid: false, reason: 'There is already a connected edge' };

      return { isValid: true };
    });

    registerNodeDropValidator('startNode')((nodes, droppableNode) => {
      if (nodes.find(node => node.type === 'startNode')) return false;

      return true;
    });

    registerNodeDropValidator('terminateNode')((nodes, droppableNode) => {
      if (nodes.find(node => node.type === 'terminateNode')) return false;

      return true;
    });
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    unselectAllElements();
  }

  return <DraggableReactFlowy
    edgeTypes={edgeTypes}
    nodeTypes={nodeTypes}
    snapToGrid={true}
    snapGrid={[8, 8]}
    onLoad={handleLoad}
    onBackgroundClick={handleBackgroundClick}
  >
    <Toolbar />
    <Background color="#aaa" gap={32} variant={BackgroundVariant.Lines} />
  </DraggableReactFlowy>;
}

export default Workflow;
