# ServiceResults Project

The ServiceResults project provides standardized result handling and exchange functionality for the Trinsic SDK across all supported languages and platforms.

## Overview

This project consolidates the result-handling patterns that were previously scattered across individual SDK samples, providing:

- Standardized result exchange request/response models
- Common result processing utilities  
- Consistent error handling for result operations
- Cross-platform compatibility

## Structure

```
service-results/
├── README.md                    # This file
├── csharp/                      # C# implementation
├── java/                        # Java implementation  
├── typescript/                  # TypeScript implementation
├── go/                          # Go implementation
├── php/                         # PHP implementation
├── python/                      # Python implementation
├── ruby/                        # Ruby implementation
└── shared/                      # Common specifications and schemas
```

## Usage

Each language-specific directory contains implementations that can be used in the corresponding SDK samples. The implementations follow the same patterns and interfaces for consistency across platforms.

### Common Features

All implementations provide:

1. **ExchangeResultRequest** - Standard request model for result exchange
2. **ResultProcessor** - Utility class for processing session results
3. **ResultExchanger** - Service class for exchanging result access keys
4. **Error handling** - Consistent error handling across platforms

## Integration

To integrate ServiceResults into your SDK sample:

1. Copy the appropriate language implementation to your project
2. Update your routes/endpoints to use the ServiceResults classes
3. Replace direct API calls with ServiceResults utilities

See individual language directories for specific integration instructions.