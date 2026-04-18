// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.unmock('axios');
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    throttledGetDataFromApi.cancel();
  });

  test('should create instance with provided base url', async () => {
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: {} }),
    } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    const promise = throttledGetDataFromApi('/test');
    jest.runAllTimers();
    await promise;

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: {} }),
    } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    const promise = throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    await promise;

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/posts/1';
    const data = { id: 'string' };
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data }),
    } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    const promise = throttledGetDataFromApi(relativePath);
    jest.runAllTimers();
    const responseData = await promise;

    expect(responseData).toEqual(data);
  });
});
