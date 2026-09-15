import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import StatePage from '@/pages/StatePage';
import DistrictPage from '@/pages/DistrictPage';
import IndicatorPage from '@/pages/IndicatorPage';
import ComparisonPage from '@/pages/ComparisonPage';
import DataSourcesPage from '@/pages/DataSourcesPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import Visualizer3DPage from '@/pages/Visualizer3DPage';
import IntelligencePage from '@/pages/IntelligencePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="3d-visualizer" element={<Visualizer3DPage />} />
        <Route path="intelligence" element={<IntelligencePage />} />
        <Route path="india/:stateId" element={<StatePage />} />
        <Route path="india/:stateId/:districtId" element={<DistrictPage />} />
        <Route path="india/:stateId/:districtId/:year/:indicator" element={<IndicatorPage />} />
        <Route path="compare" element={<ComparisonPage />} />
        <Route path="data-sources" element={<DataSourcesPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
