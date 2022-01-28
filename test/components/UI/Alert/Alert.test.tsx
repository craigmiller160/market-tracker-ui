import { createRenderApp } from '../../../testutils/RenderApp';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';

const mockApi = new MockAdapter(ajaxApi.instance)
const renderApp = createRenderApp(mockApi);

describe('Alert', () => {
    it('shows success alert, and hides on click of X', () => {
        throw new Error()
    });

    it('shows error alert, and hides on click of X', () => {
        throw new Error()
    });
})
