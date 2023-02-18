import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';

export const mockApi = new MockAdapter(ajaxApi.instance);
