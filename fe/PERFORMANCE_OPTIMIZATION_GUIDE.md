# Hướng Dẫn Tối Ưu Performance - Chia Sẻ Khóa Học

## Đã Thực Hiện

### 1. Image Optimization
- ✅ **NcImage Component**: Lazy loading với Intersection Observer
- ✅ **WebP Support**: Hỗ trợ format hình ảnh hiện đại
- ✅ **Responsive Images**: Sizes attribute cho responsive loading
- ✅ **Error Handling**: Xử lý lỗi tải hình ảnh
- ✅ **Placeholder Support**: Loading placeholder cho UX tốt hơn

### 2. React Performance
- ✅ **React.memo**: Tránh re-render không cần thiết
- ✅ **useMemo & useCallback**: Tối ưu tính toán và functions
- ✅ **Lazy Loading**: Code splitting với React.lazy và Suspense
- ✅ **Custom Hooks**: useDebounce, useThrottle, useIntersectionObserver

### 3. Build Optimization
- ✅ **Vite Config**: Tối ưu build với code splitting
- ✅ **Manual Chunks**: Tách vendor, router, UI libraries
- ✅ **Terser Minification**: Loại bỏ console.log và debugger
- ✅ **Bundle Analysis**: Theo dõi bundle size

### 4. Component Optimization
- ✅ **ProductCard**: Memoized với lazy loading images
- ✅ **LoadingProduct**: Tối ưu skeleton loading
- ✅ **Logo**: Memoized với eager loading cho critical images
- ✅ **useWindowResize**: Debounced resize handler

### 5. Performance Monitoring
- ✅ **PerformanceMonitor**: Real-time Core Web Vitals tracking
- ✅ **Custom Hooks**: usePerformanceMonitor cho development
- ✅ **Memory Leak Prevention**: useCleanup hook

## Cần Thực Hiện Tiếp

### 1. Bundle Analysis
- [ ] Setup bundle analyzer
- [ ] Monitor bundle size trends
- [ ] Optimize large dependencies
- [ ] Tree shaking optimization

### 2. Caching Strategy
- [ ] Service Worker implementation
- [ ] Browser caching optimization
- [ ] API response caching
- [ ] Static asset caching

### 3. Critical Rendering Path
- [ ] Critical CSS inline
- [ ] Preload critical resources
- [ ] Defer non-critical CSS/JS
- [ ] Optimize font loading

### 4. Database & API Optimization
- [ ] API response compression
- [ ] Database query optimization
- [ ] Pagination implementation
- [ ] API rate limiting

### 5. Advanced Optimizations
- [ ] Virtual scrolling for large lists
- [ ] Web Workers for heavy computations
- [ ] Progressive Web App (PWA)
- [ ] CDN implementation

## Best Practices

### 1. Image Optimization
```tsx
// ✅ Good
<NcImage 
  src={imageUrl}
  alt="Product description"
  lazy={true}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder={placeholderUrl}
/>

// ❌ Bad
<img src={imageUrl} alt="Product" />
```

### 2. Component Memoization
```tsx
// ✅ Good
const MyComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    // handle click
  }, []);

  return <div onClick={handleClick}>{processedData}</div>;
});

// ❌ Bad
const MyComponent = ({ data }) => {
  const processedData = expensiveCalculation(data); // Recalculates on every render
  return <div>{processedData}</div>;
};
```

### 3. Lazy Loading
```tsx
// ✅ Good
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 4. Performance Hooks
```tsx
// ✅ Good
const debouncedSearch = useDebounce(searchFunction, 300);
const throttledScroll = useThrottle(scrollHandler, 100);

// Performance monitoring
usePerformanceMonitor('ProductList');
```

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Loading Performance
- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.8s
- **Bundle Size**: < 500KB (gzipped)

### User Experience
- **Page Load Time**: < 3s
- **Image Load Time**: < 1s
- **Smooth Scrolling**: 60fps

## Monitoring Tools

### Development
- Chrome DevTools Performance tab
- React DevTools Profiler
- PerformanceMonitor component
- Bundle analyzer

### Production
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Real User Monitoring (RUM)

## Checklist Trước Khi Deploy
- [ ] All images optimized and lazy loaded
- [ ] Components memoized where appropriate
- [ ] Bundle size under limits
- [ ] Core Web Vitals meet targets
- [ ] No memory leaks detected
- [ ] Performance tests passing
- [ ] Caching strategy implemented
- [ ] CDN configured (if applicable)

## Performance Budget
- **JavaScript**: 300KB (gzipped)
- **CSS**: 50KB (gzipped)
- **Images**: 1MB total
- **Fonts**: 100KB (gzipped)
- **Total**: 500KB (gzipped)

## Continuous Monitoring
- Set up automated performance testing
- Monitor Core Web Vitals in production
- Track bundle size changes
- Alert on performance regressions
- Regular performance audits 