package online.wooden.market.config;

import com.deevvi.device.detector.engine.api.DeviceDetectorParser;
import com.deevvi.device.detector.engine.api.DeviceDetectorResult;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

import static online.wooden.market.utils.Constant.DEVICE_ATTRIBUTE;

public class DeviceDetectionFilter implements Filter {

    private final DeviceDetectorParser parser = DeviceDetectorParser.getClient();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String userAgent = httpRequest.getHeader("User-Agent");
            DeviceDetectorResult result = parser.parse(userAgent != null ? userAgent : "");

            String deviceType;
            if (result.isBot()) {
                deviceType = "bot";
            } else if (result.isMobileDevice()) {
                deviceType = "mobile";
            } else {
                // Đọc deviceType từ JSON trả về
                String json = result.toJSON();
                if (json.contains("\"deviceType\":\"tablet\"")) {
                    deviceType = "tablet";
                } else {
                    deviceType = "desktop";
                }
            }

            httpRequest.setAttribute(DEVICE_ATTRIBUTE, deviceType);
        }

        chain.doFilter(request, response);
    }
}
